-- DEMONSTRATION SEED DATA FOR NATIONAL PROJECT EXPO
-- CAMPUS COMPLAINT AND SERVICE MANAGEMENT SYSTEM

-- 1. SEED DEPARTMENTS
INSERT INTO public.departments (id, name, code, head_name, head_email) VALUES
('d1111111-1111-1111-1111-111111111111', 'Electrical & Maintenance', 'ELEC', 'Prof. Sarah Jenkins', 'sarah.jenkins@nriuniv.edu'),
('d2222222-2222-2222-2222-222222222222', 'Plumbing & Water Management', 'PLUM', 'Mr. Robert Vance', 'robert.vance@nriuniv.edu'),
('d3333333-3333-3333-3333-333333333333', 'IT Infrastructure & Wi-Fi', 'ITINF', 'Dr. Alan Turing', 'alan.turing@nriuniv.edu'),
('d4444444-4444-4444-4444-444444444444', 'Sanitation & Hygiene', 'CLEAN', 'Mrs. Martha Stewart', 'martha.s@nriuniv.edu'),
('d5555555-5555-5555-5555-555555555555', 'Campus Transport Services', 'TRANS', 'Mr. David Miller', 'david.m@nriuniv.edu'),
('d6666665-6666-6666-6666-666666666666', 'Campus Security', 'SEC', 'Capt. Richard Thorne', 'richard.t@nriuniv.edu')
ON CONFLICT (name) DO NOTHING;

-- Note: Demo accounts in live app can log in via demo switcher or Supabase Auth.
-- Demo Accounts Preset mapping:
-- Student: Alex Johnson (alex.johnson@demo.nriuniv.edu)
-- Staff: Rajesh Kumar (rajesh.kumar@demo.nriuniv.edu) - Senior Electrician
-- Admin: Prof. Sarah Jenkins (sarah.jenkins@demo.nriuniv.edu) - Facilities Admin
-- Super Admin: Dr. Marcus Vance (marcus.vance@demo.nriuniv.edu) - Director of Campus Operations
