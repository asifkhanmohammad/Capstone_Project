-- CAMPUS COMPLAINT AND SERVICE MANAGEMENT SYSTEM
-- PostgreSQL Schema & Row Level Security Migration File

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('student', 'staff', 'admin', 'super_admin');
CREATE TYPE complaint_category AS ENUM (
  'electrical',
  'plumbing',
  'internet_wifi',
  'hostel',
  'classroom',
  'laboratory',
  'cleaning',
  'transport',
  'security',
  'canteen',
  'library',
  'other'
);
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'emergency');
CREATE TYPE complaint_status AS ENUM (
  'submitted',
  'verified',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
  'rejected',
  'reopened'
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  head_name TEXT,
  head_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  phone TEXT,
  avatar_url TEXT,
  student_id_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category complaint_category NOT NULL,
  priority priority_level NOT NULL DEFAULT 'medium',
  status complaint_status NOT NULL DEFAULT 'submitted',
  location TEXT NOT NULL,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  due_at TIMESTAMPTZ NOT NULL,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- 5. COMPLAINT UPDATES & TIMELINE
CREATE TABLE IF NOT EXISTS public.complaint_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  old_status complaint_status,
  new_status complaint_status,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL UNIQUE REFERENCES public.complaints(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  is_satisfied BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_slot TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_complaints_student ON public.complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_staff ON public.complaints(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_complaints_dept ON public.complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- TRIGGER FUNCTION FOR SLA DUE DATE CALCULATION
CREATE OR REPLACE FUNCTION set_complaint_sla()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_at IS NULL THEN
    IF NEW.priority = 'emergency' THEN
      NEW.due_at := NEW.created_at + INTERVAL '2 hours';
    ELSIF NEW.priority = 'high' THEN
      NEW.due_at := NEW.created_at + INTERVAL '6 hours';
    ELSIF NEW.priority = 'medium' THEN
      NEW.due_at := NEW.created_at + INTERVAL '24 hours';
    ELSE
      NEW.due_at := NEW.created_at + INTERVAL '72 hours';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_complaint_sla
BEFORE INSERT ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION set_complaint_sla();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Departments Policies
CREATE POLICY "Public read departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admins manage departments" ON public.departments FOR ALL USING (
  get_user_role(auth.uid()) IN ('admin', 'super_admin')
);

-- Complaints Policies
CREATE POLICY "Students see own complaints" ON public.complaints FOR SELECT USING (
  student_id = auth.uid()
  OR assigned_staff_id = auth.uid()
  OR get_user_role(auth.uid()) IN ('admin', 'super_admin')
);
CREATE POLICY "Students insert complaints" ON public.complaints FOR INSERT WITH CHECK (
  auth.uid() = student_id
);
CREATE POLICY "Staff & Admins update complaints" ON public.complaints FOR UPDATE USING (
  assigned_staff_id = auth.uid()
  OR get_user_role(auth.uid()) IN ('admin', 'super_admin', 'staff')
);

-- Notifications Policies
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Feedback Policies
CREATE POLICY "Students submit feedback" ON public.feedback FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "All users view feedback" ON public.feedback FOR SELECT USING (true);

-- Service Requests Policies
CREATE POLICY "Students view own service requests" ON public.service_requests FOR SELECT USING (
  student_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin', 'super_admin')
);
CREATE POLICY "Students create service requests" ON public.service_requests FOR INSERT WITH CHECK (student_id = auth.uid());
