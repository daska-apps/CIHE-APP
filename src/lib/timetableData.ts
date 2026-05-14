export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

/** 
 * CIHE Timetable Core Data
 * Designed and Maintained by Anthony Daskalakis
 * Copyright 2026 CIHE
 */
export type SlotId = 'm' | 'n' | 'a' | 'e';

export interface ClassSession {
  unitCode: string;
  day: Day;
  slot: SlotId;
  room: string;
}

export interface StudentTimetable {
  id: string;
  sessions: ClassSession[];
}

export interface UnitInfo {
  code: string;
  title: string;
  tutor: string;
  moodleUrl?: string;
  guideUrl?: string;
}

export const UNIT_TITLES: Record<string, UnitInfo> = {
  ICT932: { 
    code: 'ICT932', 
    title: 'IT Infrastructure & Networking', 
    tutor: 'Mutaz',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=932',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT932'
  },
  ICT940: { 
    code: 'ICT940', 
    title: 'Data Analytics & Visualization', 
    tutor: 'Madhumita',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=940',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT940'
  },
  ICT946: { 
    code: 'ICT946', 
    title: 'Capstone Project', 
    tutor: 'John Ayoade',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=946'
  },
  ICT930: { 
    code: 'ICT930', 
    title: 'Database Systems', 
    tutor: 'Javad',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=930'
  },
  ICT942: { 
    code: 'ICT942', 
    title: 'Cloud Computing', 
    tutor: 'Nazila',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=942'
  },
  ICT945: { 
    code: 'ICT945', 
    title: 'Cyber Security Operations', 
    tutor: 'Barak',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT945'
  },
  ICT934: { 
    code: 'ICT934', 
    title: 'Web Development', 
    tutor: 'Qurat',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=934'
  },
  ICT931: { 
    code: 'ICT931', 
    title: 'Systems Analysis', 
    tutor: 'Madhumita',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT931'
  },
  ICT304: { 
    code: 'ICT304', 
    title: 'Web Application Frameworks', 
    tutor: 'Qurat',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=304',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT304'
  },
  ICT309: { 
    code: 'ICT309', 
    title: 'IT Governance', 
    tutor: 'Barak',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT309'
  },
  ICT306: { 
    code: 'ICT306', 
    title: 'Distributed Systems', 
    tutor: 'Dr. Barjinder Singh',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=306'
  },
  ICT104: { 
    code: 'ICT104', 
    title: 'Programming Fundamentals', 
    tutor: 'Qurat',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=104',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT104'
  },
  ICT203: { 
    code: 'ICT203', 
    title: 'User Experience Design', 
    tutor: 'Nazila',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=203',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT203'
  },
  ICT208: { 
    code: 'ICT208', 
    title: 'Algorithms & Data Structures', 
    tutor: 'Qurat',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=208',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT208'
  },
  ICT301: { 
    code: 'ICT301', 
    title: 'IT Project Management', 
    tutor: 'Madhumita',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=301',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT301'
  },
  ICT206: { 
    code: 'ICT206', 
    title: 'Introduction to AI', 
    tutor: 'Dr. Ancy',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=206'
  },
  ICT308: { 
    code: 'ICT308', 
    title: 'Testing & Quality Assurance', 
    tutor: 'Javad',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=308'
  },
  ICT305: { 
    code: 'ICT305', 
    title: 'Internet of Things', 
    tutor: 'Dr. Farrukh',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=305',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT305'
  },
  ICT204: { 
    code: 'ICT204', 
    title: 'Communication Networks', 
    tutor: 'Dr. Shadi',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=204'
  },
  ICT202: { 
    code: 'ICT202', 
    title: 'Operating Systems', 
    tutor: 'John',
    guideUrl: 'https://cihe.edu.au/unit-guides/ICT202'
  },
  ICT101: { 
    code: 'ICT101', 
    title: 'Discrete Mathematics', 
    tutor: 'Madhumita',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=101'
  },
  ICT102: { code: 'ICT102', title: 'Computer Systems', tutor: 'Mutaz' },
  ICT201: { code: 'ICT201', title: 'Database Design', tutor: 'Javad' },
  BUS201: { 
    code: 'BUS201', 
    title: 'Business Law', 
    tutor: 'Prof. Richard',
    guideUrl: 'https://cihe.edu.au/unit-guides/BUS201'
  },
  BUS206: { 
    code: 'BUS206', 
    title: 'Management Principles', 
    tutor: 'Dr. Amina',
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=206',
    guideUrl: 'https://cihe.edu.au/unit-guides/BUS206'
  },
  CS104: { code: 'CS104', title: 'Computer Graphics', tutor: 'Dr. Sarah' },
  CS205: { code: 'CS205', title: 'Placement 1', tutor: 'Hallam Wye' },
  CS304: { code: 'CS304', title: 'Machine Learning', tutor: 'Dr. David' },
  CS301: { code: 'CS301', title: 'Artificial Intelligence', tutor: 'Dr. Michael' },
  CS107: { code: 'CS107', title: 'Introduction to CS', tutor: 'Staff' },
  CS206: { code: 'CS206', title: 'Human Computer Interaction', tutor: 'Staff' },
  CS202: { code: 'CS202', title: 'Logic & Computation', tutor: 'Staff' },
  CS201: { code: 'CS201', title: 'Data Structures', tutor: 'Staff' },
  CS203: { code: 'CS203', title: 'Systems Programming', tutor: 'Staff' },
  CS306: { code: 'CS306', title: 'Advanced Networking', tutor: 'Staff' },
  CS305: { code: 'CS305', title: 'Cloud Systems', tutor: 'Staff' },
  EC100: { code: 'EC100', title: 'Economic Analysis', tutor: 'Staff' },
  EC101: { code: 'EC101', title: 'Microeconomics', tutor: 'Staff' },
  EC102: { code: 'EC102', title: 'Macroeconomics', tutor: 'Staff' },
  EC103: { code: 'EC103', title: 'Economic Principles', tutor: 'Staff' },
  EC104: { code: 'EC104', title: 'Business Statistics', tutor: 'Staff' },
  EC105: { code: 'EC105', title: 'Corporate Finance', tutor: 'Staff' },
  EC106: { code: 'EC106', title: 'Managerial Accounting', tutor: 'Staff' },
  EC503: { code: 'EC503', title: 'Advanced Macroeconomics', tutor: 'Staff' },
  EC504: { code: 'EC504', title: 'Research Econometrics', tutor: 'Staff' },
  EC505: { code: 'EC505', title: 'International Trade', tutor: 'Staff' },
  ECP502: { code: 'ECP502', title: 'Economics Capstone', tutor: 'Staff' },
  ACC101: { code: 'ACC101', title: 'Financial Accounting', tutor: 'Dr. Amina' },
  ACC102: { code: 'ACC102', title: 'Management Accounting', tutor: 'Dr. Ancy' },
  ACC951: { code: 'ACC951', title: 'Auditing & Assurance', tutor: 'Dr. Barjinder Singh' },
  ICT950: { code: 'ICT950', title: 'IT Strategy & Planning', tutor: 'Dr. Farrukh' },
  RES904: { code: 'RES904', title: 'Thesis Seminar', tutor: 'Dr. Shadi' },
  BUS101: { code: 'BUS101', title: 'Business Foundations', tutor: 'Prof. Richard' },
  BUS102: { code: 'BUS102', title: 'Organizational Behavior', tutor: 'Dr. Amina' },
  BUS108: { code: 'BUS108', title: 'Marketing Foundations', tutor: 'Dr. Sarah' },
  BUS112: { code: 'BUS112', title: 'Human Resource Management', tutor: 'Dr. Michael' },
  BUS114: { code: 'BUS114', title: 'Entrepreneurship', tutor: 'Dr. David' },
  BUS202: { code: 'BUS202', title: 'Digital Marketing', tutor: 'Dr. Ancy' },
  BUS301: { code: 'BUS301', title: 'Strategic Management', tutor: 'Dr. Barjinder Singh' },
  HOST305: { code: 'HOST305', title: 'Hospitality Management', tutor: 'Staff' },
  // Early Childhood Education — WA Campus (Perth, opened Semester 1 2026)
  ECE101: { code: 'ECE101', title: 'Introduction to Early Childhood Education', tutor: 'Prof. Annie Venville' },
  ECE201: { code: 'ECE201', title: 'Child Development (Birth to Five)', tutor: 'Prof. Annie Venville' },
  ECE202: { code: 'ECE202', title: 'Language & Literacy for Young Children', tutor: 'Staff' },
  ECE301: { code: 'ECE301', title: 'Early Childhood Curriculum & Pedagogy', tutor: 'Prof. Annie Venville' },
  ECE302: { code: 'ECE302', title: 'Inclusive Education Practices', tutor: 'Staff' },
  ECE401: { code: 'ECE401', title: 'Practicum in Early Childhood Settings', tutor: 'Staff' },
  ECE501: { code: 'ECE501', title: 'Leadership in Early Childhood', tutor: 'Prof. Grant Jones' },
  ECE601: { code: 'ECE601', title: 'Research in Early Childhood', tutor: 'Prof. Grant Jones' },
  // Graduate Diploma Early Childhood
  GDE101: { code: 'GDE101', title: 'Graduate Foundations: Early Childhood', tutor: 'Prof. Annie Venville' },
  GDE201: { code: 'GDE201', title: 'Advanced Pedagogy & Assessment', tutor: 'Staff' },
  ECP001: { code: 'ECP001', title: 'Economics Placement', tutor: 'Staff' },
  RES901: { code: 'RES901', title: 'Research Methodology', tutor: 'Dr. Shadi' },
  RES902: { code: 'RES902', title: 'Literature Review', tutor: 'Dr. Farrukh' },
  RES903: { code: 'RES903', title: 'Research proposal', tutor: 'Dr. Ancy' },
  CS207: { code: 'CS207', title: 'Network Infrastructure', tutor: 'Mutaz' },
};

export const parseSlot = (slotStr: string): ClassSession => {
  const match = slotStr.match(/^(.+?)\((.+?)-(.+?)-(.+?)\)$/);
  if (!match) throw new Error(`Invalid slot format: ${slotStr}`);
  return {
    unitCode: match[1],
    day: match[2] as Day,
    slot: match[3] as SlotId,
    room: match[4],
  };
};

export const TIMETABLE_A: StudentTimetable[] = [
  { id: 'CIHE21351', sessions: [parseSlot('ICT932(Tue-a-M505)'), parseSlot('ICT940(Wed-m-M507)'), parseSlot('ICT946(Tue-n-M506)')] },
  { id: 'CIHE21366', sessions: [parseSlot('ICT946(Tue-n-M506)')] },
  { id: 'CIHE21544', sessions: [parseSlot('EC101(Fri-n-M507)'), parseSlot('EC102(Fri-a-M507)'), parseSlot('EC100(Mon-e-M507)'), parseSlot('EC103(Fri-m-M505)')] },
  { id: 'CIHE21603', sessions: [parseSlot('ICT930(Wed-e-M502)'), parseSlot('ICT942(Wed-n-M503)'), parseSlot('ICT945(Tue-m-M501)'), parseSlot('ICT934(Tue-n-M501)')] },
  { id: 'CIHE22079', sessions: [parseSlot('ICT931(Tue-a-M501)'), parseSlot('ICT921(Tue-m-M507)'), parseSlot('ICT922(Thu-m-M507)'), parseSlot('ICT923(Tue-n-M504)')] },
  { id: 'CIHE22122', sessions: [parseSlot('ICT945(Tue-m-M501)'), parseSlot('ICT932(Tue-a-M505)'), parseSlot('ICT940(Wed-m-M507)'), parseSlot('ICT946(Tue-n-M506)')] },
  { id: 'CIHE22479', sessions: [parseSlot('ICT307(Mon-n-M502)'), parseSlot('ICT205(Mon-a-M504)'), parseSlot('ICT313(Wed-e-M503)'), parseSlot('BUS206(Wed-n-M504)')] },
  { id: 'CIHE22532', sessions: [parseSlot('BUS201(Wed-a-M507)'), parseSlot('BUS206(Fri-n-M505)')] },
  { id: 'CIHE23022', sessions: [parseSlot('BUS201(Wed-a-M507)')] },
  { id: 'CIHE23043', sessions: [parseSlot('ICT930(Wed-e-M502)'), parseSlot('ICT931(Wed-a-M504)'), parseSlot('ICT942(Wed-n-M503)'), parseSlot('ICT920(Tue-a-M502)')] },
  { id: 'CIHE23094', sessions: [parseSlot('ICT930(Wed-e-M502)'), parseSlot('ICT942(Wed-n-M503)'), parseSlot('ICT945(Tue-m-M501)'), parseSlot('ICT934(Tue-n-M501)')] },
  { id: 'CIHE231043', sessions: [parseSlot('BUS201(Fri-a-M503)'), parseSlot('ICT304(Wed-a-M505)'), parseSlot('BUS206(Fri-n-M505)')] },
  { id: 'CIHE231174', sessions: [parseSlot('BUS201(Wed-a-M507)'), parseSlot('ICT309(Thu-n-M504)'), parseSlot('ICT306(Thu-m-M502)'), parseSlot('BUS206(Thu-a-M505)')] },
  { id: 'CIHE231191', sessions: [parseSlot('BUS201(Wed-e-M501)'), parseSlot('ICT304(Wed-a-M505)')] },
  { id: 'CIHE231230', sessions: [parseSlot('BUS201(Fri-a-M503)')] },
  { id: 'CIHE231235', sessions: [parseSlot('ICT930(Wed-e-M502)'), parseSlot('ICT942(Wed-n-M503)'), parseSlot('ICT945(Tue-m-M501)'), parseSlot('ICT920(Tue-a-M502)')] },
  { id: 'CIHE231245', sessions: [parseSlot('BUS201(Wed-a-M507)')] },
  { id: 'CIHE231261', sessions: [parseSlot('BUS201(Fri-a-M503)'), parseSlot('ICT304(Wed-a-M505)')] },
  { id: 'CIHE23136', sessions: [parseSlot('ICT930(Wed-e-M502)'), parseSlot('ICT931(Wed-a-M504)'), parseSlot('ICT942(Wed-n-M503)'), parseSlot('ICT934(Tue-n-M501)')] },
  { id: 'CIHE231368', sessions: [parseSlot('ICT306(Thu-m-P102)'), parseSlot('BUS206(Tue-a-M507)')] },
  { id: 'CIHE231425', sessions: [parseSlot('BUS201(Fri-a-C203)'), parseSlot('ICT304(Wed-a-M505)')] },
  { id: 'CIHE231429', sessions: [parseSlot('ICT104(Wed-m-P301)'), parseSlot('ICT203(Thu-e-C105)'), parseSlot('ICT313(Thu-a-M504)'), parseSlot('BUS206(Wed-n-P504)')] },
  { id: 'CIHE231486', sessions: [parseSlot('ICT945(Tue-m-M501)'), parseSlot('ICT932(Tue-a-M505)'), parseSlot('ICT940(Wed-m-M507)'), parseSlot('ICT946(Tue-n-M506)')] },
  { id: 'CIHE231525', sessions: [parseSlot('ICT307(Mon-n-M502)'), parseSlot('ICT309(Thu-n-M504)'), parseSlot('ICT205(Mon-a-M504)'), parseSlot('BUS206(Thu-a-M505)')] },
  { id: 'CIHE231559', sessions: [parseSlot('ICT208(Thu-m-M504)'), parseSlot('ICT301(Thu-n-M503)'), parseSlot('ICT313(Wed-e-M503)'), parseSlot('BUS206(Thu-a-M505)')] },
  { id: 'CIHE231577', sessions: [parseSlot('ICT104(Wed-m-M503)'), parseSlot('ICT203(Thu-e-M505)'), parseSlot('ICT206(Wed-n-M505)'), parseSlot('BUS206(Wed-a-M502)')] },
  { id: 'CIHE231595', sessions: [parseSlot('ICT104(Wed-m-M503)'), parseSlot('ICT203(Thu-e-M505)'), parseSlot('ICT206(Wed-n-M505)'), parseSlot('BUS206(Wed-a-M502)')] },
  { id: 'CIHE231605', sessions: [parseSlot('BUS201(Fri-a-M503)'), parseSlot('ICT308(Wed-m-M504)'), parseSlot('ICT304(Wed-a-M505)'), parseSlot('BUS206(Fri-n-M505)')] },
  { id: 'CIHE231619', sessions: [parseSlot('ICT208(Tue-n-M507)'), parseSlot('ICT306(Thu-m-M502)'), parseSlot('ICT313(Thu-a-M504)'), parseSlot('BUS206(Tue-a-M507)')] },
  { id: 'CIHE231641', sessions: [parseSlot('ICT301(Thu-n-M503)'), parseSlot('ICT305(Wed-a-M503)'), parseSlot('ICT313(Wed-e-M503)'), parseSlot('BUS206(Thu-a-M505)')] },
  { id: 'CIHE231650', sessions: [parseSlot('ICT208(Mon-n-M507)'), parseSlot('ICT204(Mon-e-M502)'), parseSlot('ICT205(Mon-a-M504)'), parseSlot('BUS206(Tue-a-M507)')] },
  { id: 'CIHE231662', sessions: [parseSlot('ICT930(Thu-a-M502)'), parseSlot('ICT931(Wed-a-M504)'), parseSlot('ICT922(Thu-m-M507)'), parseSlot('ICT934(Thu-n-M505)')] },
  { id: 'CIHE231693', sessions: [parseSlot('ICT930(Wed-e-M502)'), parseSlot('ICT931(Wed-a-M504)'), parseSlot('ICT920(Tue-a-M502)'), parseSlot('ICT942(Wed-n-M503)')] },
  { id: 'CIHE231698', sessions: [parseSlot('ICT945(Tue-m-M501)'), parseSlot('ICT932(Tue-a-M505)'), parseSlot('ICT940(Wed-m-M507)'), parseSlot('ICT946(Tue-n-M506)')] },
  { id: 'CIHE240103', sessions: [parseSlot('ICT309(Thu-n-M504)'), parseSlot('ICT305(Wed-a-M503)'), parseSlot('ICT313(Wed-e-M503)'), parseSlot('BUS206(Thu-m-M503)')] },
  { id: 'CIHE240149', sessions: [parseSlot('ICT205(Mon-a-M504)'), parseSlot('BUS206(Fri-n-M505)')] },
  { id: 'CIHE240163', sessions: [parseSlot('ICT208(Thu-m-M504)'), parseSlot('ICT203(Fri-a-M505)'), parseSlot('ICT301(Thu-n-M503)'), parseSlot('BUS206(Fri-n-M505)')] },
  { id: 'CIHE240179', sessions: [parseSlot('ICT307(Mon-n-M502)'), parseSlot('ICT309(Thu-n-M504)'), parseSlot('ICT205(Mon-a-M504)'), parseSlot('BUS206(Thu-a-M505)')] },
  { id: 'CIHE24021', sessions: [parseSlot('ICT208(Thu-m-M504)'), parseSlot('ICT305(Wed-a-M503)'), parseSlot('ICT313(Wed-e-M503)'), parseSlot('BUS206(Wed-n-M504)')] },
  { id: 'CIHE240222', sessions: [parseSlot('RES902(Mon-a-M505)'), parseSlot('RES903(Thu-n-M506)'), parseSlot('RES901(Mon-n-M506)'), parseSlot('ICT950(Mon-m-M502)')] },
  { id: 'CIHE240237', sessions: [parseSlot('ICT208(Thu-m-M504)'), parseSlot('ICT203(Fri-a-M505)'), parseSlot('ICT301(Thu-n-M503)'), parseSlot('BUS206(Fri-n-M505)')] },
  { id: 'CIHE240256', sessions: [parseSlot('BUS201(Fri-a-M503)'), parseSlot('ICT308(Wed-m-M504)'), parseSlot('ICT304(Wed-a-M505)'), parseSlot('BUS206(Wed-n-M504)')] },
  { id: 'CIHE240293', sessions: [parseSlot('BUS201(Fri-a-M503)'), parseSlot('ICT308(Wed-m-M504)'), parseSlot('ICT304(Wed-a-M505)'), parseSlot('BUS206(Wed-n-M504)')] },
  { id: 'CIHE240307', sessions: [parseSlot('BUS201(Wed-e-M501)'), parseSlot('ICT304(Wed-a-M505)'), parseSlot('BUS206(Wed-n-M504)')] },
  { id: 'CIHE240327', sessions: [parseSlot('ICT208(Mon-n-M507)'), parseSlot('ICT307(Wed-m-M502)'), parseSlot('ICT205(Mon-a-M504)'), parseSlot('BUS206(Wed-a-M502)')] },
  { id: 'CIHE241026', sessions: [parseSlot('CS203(Thu-a-M501)'), parseSlot('CS206(Fri-e-M501)'), parseSlot('CS207(Thu-m-M506)'), parseSlot('CS304(Thu-n-M507)')] },
  { id: 'CIHE241047', sessions: [parseSlot('CS203(Thu-a-M501)'), parseSlot('CS201(Tue-a-M506)'), parseSlot('CS206(Thu-n-M501)'), parseSlot('CS304(Tue-n-M502)')] },
  { id: 'CIHE250812', sessions: [parseSlot('ICT208(Tue-n-M507)'), parseSlot('ICT203(Tue-e-M503)'), parseSlot('ICT313(Wed-e-M503)'), parseSlot('BUS206(Tue-a-M507)')] },
  { id: 'CIHE250815', sessions: [parseSlot('EC106(Tue-m-M504)'), parseSlot('ECP001(Fri-m-M503)'), parseSlot('EC104(Tue-a-M504)'), parseSlot('EC105(Tue-n-M503)')] },
  { id: 'CIHE250850', sessions: [parseSlot('ACC101(Fri-n-M503)'), parseSlot('BUS202(Fri-e-M507)'), parseSlot('BUS114(Fri-a-M502)'), parseSlot('HOST305(Thu-e-M502)')] },
  { id: 'CIHE251311', sessions: [parseSlot('EC503(Mon-e-M505)'), parseSlot('EC504(Thu-a-M503)'), parseSlot('EC505(Mon-n-M503)'), parseSlot('ECP502(Mon-a-M507)')] },
  { id: 'CIHE260892', sessions: [parseSlot('ACC951(Fri-n-M502)'), parseSlot('ICT950(Mon-m-M502)'), parseSlot('RES904(Fri-m-M502)')] },

  // ── ACT Campus students ──────────────────────────────────────
  // A1xxx = ACT>>ACT01 Gungahlin | A2xxx = ACT>>ACT02 Belconnen | A3xxx = ACT>>ACT03 Mitchell
  { id: 'CIHE271001', sessions: [parseSlot('ICT104(Mon-m-A1101)'), parseSlot('ICT203(Mon-n-A1102)'), parseSlot('BUS206(Tue-m-A1101)'), parseSlot('BUS201(Tue-n-A1102)')] },
  { id: 'CIHE271002', sessions: [parseSlot('ICT930(Wed-m-A1101)'), parseSlot('ICT942(Wed-n-A1102)'), parseSlot('ICT945(Thu-m-A1101)'), parseSlot('ICT934(Thu-n-A1102)')] },
  { id: 'CIHE271003', sessions: [parseSlot('ACC101(Mon-m-A1103)'), parseSlot('ACC102(Mon-n-A1103)'), parseSlot('BUS101(Tue-m-A1101)'), parseSlot('BUS102(Tue-n-A1101)')] },
  { id: 'CIHE271004', sessions: [parseSlot('ICT208(Wed-m-A1102)'), parseSlot('ICT301(Wed-n-A1103)'), parseSlot('BUS206(Thu-m-A1102)'), parseSlot('ICT304(Thu-n-A1103)')] },
  { id: 'CIHE271005', sessions: [parseSlot('ICT932(Tue-m-A1101)'), parseSlot('ICT940(Tue-n-A1102)'), parseSlot('ICT946(Wed-m-A1101)'), parseSlot('ICT945(Wed-n-A1101)')] },
  { id: 'CIHE271006', sessions: [parseSlot('RES901(Mon-m-A1103)'), parseSlot('RES902(Mon-n-A1103)'), parseSlot('RES903(Tue-m-A1103)'), parseSlot('ICT950(Thu-m-A1103)')] },
  { id: 'CIHE271007', sessions: [parseSlot('BUS201(Mon-m-A2101)'), parseSlot('BUS206(Mon-n-A2102)'), parseSlot('ICT104(Tue-m-A2101)')] },
  { id: 'CIHE271008', sessions: [parseSlot('ICT940(Wed-m-A2101)'), parseSlot('ICT945(Wed-n-A2102)'), parseSlot('ICT932(Thu-m-A2101)'), parseSlot('ICT946(Thu-n-A2102)')] },
  { id: 'CIHE271009', sessions: [parseSlot('ACC101(Tue-m-A2101)'), parseSlot('ACC951(Tue-n-A2102)'), parseSlot('BUS301(Wed-m-A2101)')] },
  { id: 'CIHE271010', sessions: [parseSlot('ICT104(Mon-m-A3101)'), parseSlot('ICT201(Mon-n-A3102)'), parseSlot('ICT202(Tue-m-A3101)'), parseSlot('BUS206(Tue-n-A3101)')] },
  { id: 'CIHE271011', sessions: [parseSlot('ICT930(Wed-m-A3101)'), parseSlot('ICT931(Wed-n-A3102)'), parseSlot('ICT942(Thu-m-A3101)'), parseSlot('ICT934(Thu-n-A3102)')] },
  { id: 'CIHE271012', sessions: [parseSlot('BUS101(Mon-m-A3101)'), parseSlot('BUS108(Mon-n-A3102)'), parseSlot('BUS114(Tue-m-A3101)'), parseSlot('BUS202(Tue-n-A3102)')] },
  { id: 'CIHE271013', sessions: [parseSlot('ICT208(Wed-m-A3101)'), parseSlot('ICT203(Wed-n-A3102)'), parseSlot('ICT206(Thu-m-A3101)'), parseSlot('BUS206(Thu-n-A3101)')] },
  { id: 'CIHE271014', sessions: [parseSlot('ICT940(Mon-m-A1101)'), parseSlot('ICT950(Mon-n-A1103)'), parseSlot('ACC951(Tue-m-A1102)'), parseSlot('RES904(Fri-m-A1103)')] },
  { id: 'CIHE271015', sessions: [parseSlot('ICT309(Mon-m-A2101)'), parseSlot('ICT306(Mon-n-A2102)'), parseSlot('ICT305(Tue-m-A2101)'), parseSlot('BUS301(Tue-n-A2102)')] },

  // ── WA Campus students ──────────────────────────────────────
  // Wxxx = WA>>Perth: 1325 Hay St, West Perth (opened Semester 1 2026, Early Childhood focus)
  { id: 'CIHE281001', sessions: [parseSlot('ECE101(Mon-m-W101)'), parseSlot('ECE201(Mon-n-W102)'), parseSlot('ECE301(Tue-m-W101)'), parseSlot('ECE202(Tue-n-W102)')] },
  { id: 'CIHE281002', sessions: [parseSlot('ECE101(Mon-m-W101)'), parseSlot('ECE202(Wed-m-W101)'), parseSlot('ECE302(Wed-n-W102)'), parseSlot('ECE401(Thu-m-W101)')] },
  { id: 'CIHE281003', sessions: [parseSlot('ECE201(Tue-m-W102)'), parseSlot('ECE301(Tue-n-W101)'), parseSlot('ECE401(Thu-m-W101)'), parseSlot('ECE302(Thu-n-W102)')] },
  { id: 'CIHE281004', sessions: [parseSlot('ECE501(Mon-m-W103)'), parseSlot('ECE601(Mon-n-W103)'), parseSlot('GDE101(Wed-m-W103)'), parseSlot('GDE201(Wed-n-W103)')] },
  { id: 'CIHE281005', sessions: [parseSlot('ECE101(Mon-m-W101)'), parseSlot('ECE201(Mon-n-W102)'), parseSlot('ECE202(Tue-m-W102)'), parseSlot('ECE301(Thu-m-W101)')] },
  { id: 'CIHE281006', sessions: [parseSlot('ECE501(Tue-m-W103)'), parseSlot('ECE601(Tue-n-W103)'), parseSlot('GDE201(Thu-m-W103)')] },
  { id: 'CIHE281007', sessions: [parseSlot('ECE302(Mon-m-W102)'), parseSlot('ECE401(Mon-n-W101)'), parseSlot('ECE301(Wed-m-W101)'), parseSlot('ECE202(Wed-n-W102)')] },
  { id: 'CIHE281008', sessions: [parseSlot('GDE101(Mon-m-W103)'), parseSlot('GDE201(Mon-n-W103)'), parseSlot('ECE601(Tue-m-W103)'), parseSlot('ECE501(Thu-m-W103)')] },
];

export const TIMETABLE_B: StudentTimetable[] = [
  { id: 'CIHE21351', sessions: [parseSlot('ICT932(Tue-e-M507)'), parseSlot('ICT940(Wed-a-M507)'), parseSlot('ICT946(Tue-n-M503)')] },
  { id: 'CIHE21366', sessions: [parseSlot('ICT946(Tue-n-M503)')] },
  { id: 'CIHE21544', sessions: [parseSlot('EC101(Fri-a-M507)'), parseSlot('EC102(Wed-m-M507)'), parseSlot('EC100(Wed-a-M504)'), parseSlot('EC103(Wed-n-M505)')] },
  { id: 'CIHE21603', sessions: [parseSlot('ICT930(Fri-a-M506)'), parseSlot('ICT942(Wed-n-M507)'), parseSlot('ICT945(Wed-e-M507)'), parseSlot('ICT934(Fri-m-M503)')] },
  { id: 'CIHE22079', sessions: [parseSlot('ICT931(Fri-n-M504)'), parseSlot('ICT921(Fri-a-M502)'), parseSlot('ICT922(Fri-e-M505)'), parseSlot('ICT923(Wed-e-M503)')] },
  { id: 'CIHE22122', sessions: [parseSlot('ICT945(Wed-e-M507)'), parseSlot('ICT932(Tue-e-M507)'), parseSlot('ICT940(Wed-a-M507)'), parseSlot('ICT946(Tue-n-M503)')] },
  { id: 'CIHE22479', sessions: [parseSlot('ICT307(Mon-n-M504)'), parseSlot('ICT205(Mon-a-M506)'), parseSlot('ICT313(Tue-a-M507)'), parseSlot('BUS206(Mon-e-M504)')] },
  { id: 'CIHE23043', sessions: [parseSlot('ICT930(Fri-a-M506)'), parseSlot('ICT931(Fri-n-M504)'), parseSlot('ICT942(Wed-n-M507)'), parseSlot('ICT920(Tue-a-M506)')] },
  { id: 'CIHE23094', sessions: [parseSlot('ICT930(Fri-a-M506)'), parseSlot('ICT942(Wed-n-M507)'), parseSlot('ICT945(Wed-e-M507)'), parseSlot('ICT934(Fri-m-M503)')] },
  { id: 'CIHE231174', sessions: [parseSlot('BUS201(Wed-a-M507)'), parseSlot('ICT309(Mon-n-M504)'), parseSlot('ICT306(Mon-m-M504)'), parseSlot('BUS206(Mon-a-M506)')] },
  { id: 'CIHE23136', sessions: [parseSlot('ICT930(Fri-a-M506)'), parseSlot('ICT931(Fri-n-M504)'), parseSlot('ICT942(Wed-n-M507)'), parseSlot('ICT934(Fri-m-M503)')] },
  { id: 'CIHE231486', sessions: [parseSlot('ICT945(Wed-e-M507)'), parseSlot('ICT932(Tue-e-M507)'), parseSlot('ICT940(Wed-a-M507)'), parseSlot('ICT946(Tue-n-M503)')] },
  { id: 'CIHE231693', sessions: [parseSlot('ICT930(Fri-a-M506)'), parseSlot('ICT931(Fri-n-M504)'), parseSlot('ICT920(Tue-m-M503)'), parseSlot('ICT942(Wed-n-M507)')] },
  { id: 'CIHE231698', sessions: [parseSlot('ICT945(Wed-e-M507)'), parseSlot('ICT932(Tue-e-M507)'), parseSlot('ICT940(Wed-a-M507)'), parseSlot('ICT946(Tue-n-M503)')] },
  { id: 'CIHE240222', sessions: [parseSlot('RES902(Fri-n-M502)'), parseSlot('RES903(Fri-m-M505)'), parseSlot('RES901(Mon-e-M505)'), parseSlot('ICT950(Mon-n-M503)')] },
  { id: 'CIHE260892', sessions: [parseSlot('ACC951(Tue-n-M507)'), parseSlot('ICT950(Mon-n-M503)'), parseSlot('RES904(Tue-m-M503)')] },

  // ── ACT Campus — Trimester B ──────────────────────────────
  { id: 'CIHE271001', sessions: [parseSlot('ICT104(Tue-m-A1101)'), parseSlot('ICT203(Tue-n-A1102)'), parseSlot('BUS206(Mon-m-A1101)'), parseSlot('BUS201(Mon-n-A1102)')] },
  { id: 'CIHE271002', sessions: [parseSlot('ICT930(Thu-m-A1101)'), parseSlot('ICT942(Thu-n-A1102)'), parseSlot('ICT945(Fri-m-A1101)'), parseSlot('ICT934(Fri-n-A1102)')] },
  { id: 'CIHE271003', sessions: [parseSlot('ACC101(Tue-m-A1103)'), parseSlot('ACC102(Tue-n-A1103)'), parseSlot('BUS101(Wed-m-A1101)'), parseSlot('BUS102(Wed-n-A1101)')] },
  { id: 'CIHE271007', sessions: [parseSlot('BUS201(Tue-m-A2101)'), parseSlot('BUS206(Tue-n-A2102)'), parseSlot('ICT104(Wed-m-A2101)')] },
  { id: 'CIHE271010', sessions: [parseSlot('ICT104(Tue-m-A3101)'), parseSlot('ICT201(Tue-n-A3102)'), parseSlot('ICT202(Wed-m-A3101)'), parseSlot('BUS206(Wed-n-A3101)')] },
  { id: 'CIHE271012', sessions: [parseSlot('BUS101(Tue-m-A3101)'), parseSlot('BUS108(Tue-n-A3102)'), parseSlot('BUS114(Wed-m-A3101)'), parseSlot('BUS202(Wed-n-A3102)')] },

  // ── WA Campus — Trimester B ────────────────────────────────
  { id: 'CIHE281001', sessions: [parseSlot('ECE101(Tue-m-W101)'), parseSlot('ECE201(Tue-n-W102)'), parseSlot('ECE301(Wed-m-W101)'), parseSlot('ECE202(Wed-n-W102)')] },
  { id: 'CIHE281002', sessions: [parseSlot('ECE101(Tue-m-W101)'), parseSlot('ECE202(Thu-m-W101)'), parseSlot('ECE302(Thu-n-W102)'), parseSlot('ECE401(Fri-m-W101)')] },
  { id: 'CIHE281004', sessions: [parseSlot('ECE501(Tue-m-W103)'), parseSlot('ECE601(Tue-n-W103)'), parseSlot('GDE101(Thu-m-W103)'), parseSlot('GDE201(Thu-n-W103)')] },
  { id: 'CIHE281005', sessions: [parseSlot('ECE101(Tue-m-W101)'), parseSlot('ECE201(Tue-n-W102)'), parseSlot('ECE202(Wed-m-W102)'), parseSlot('ECE301(Fri-m-W101)')] },
];

export const ALL_STUDENTS = [...new Set([...TIMETABLE_A.map(s => s.id), ...TIMETABLE_B.map(s => s.id)])];

export const getMasterSchedule = (version: 'A' | 'B'): ClassSession[] => {
  const timetable = version === 'A' ? TIMETABLE_A : TIMETABLE_B;
  const allSessions = timetable.flatMap(s => s.sessions);
  
  // Unique sessions based on unit, day, slot, and room
  const uniqueSessions: ClassSession[] = [];
  const seen = new Set<string>();

  for (const session of allSessions) {
    const key = `${session.unitCode}-${session.day}-${session.slot}-${session.room}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSessions.push(session);
    }
  }

  return uniqueSessions;
};
