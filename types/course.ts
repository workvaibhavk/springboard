// types/course.ts

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type CourseCategory =
    | 'Programming'
    | 'Web/App dev'
    | 'Cyber Security'
    | 'Computer Science'
    | 'Tech'
    | 'Creativity'
    | 'General skills';

export type CourseTag =
    | 'WebDev' | 'FullStack' | 'Frontend' | 'Backend' | 'JavaScript'
    | 'Algorithms' | 'DataStructures' | 'Python' | 'Java' | 'CSharp'
    | 'Ruby' | 'PHP' | 'GoLang' | 'Rust' | 'C++'
    | 'DevOps' | 'AWS' | 'Azure' | 'Docker' | 'Kubernetes'
    | 'MachineLearning' | 'AI' | 'DataScience' | 'BigData' | 'CloudComputing'
    | 'ReactJS' | 'NodeJS' | 'MongoDB' | 'MERN' | 'HTMLCSS'
    | 'Tailwind' | 'Bootstrap' | 'Django' | 'Flutter'
    | 'AndroidDev' | 'AppDev' | 'DSA' | 'Coding' | 'GitGitHub'
    | 'API' | 'StockMarket' | 'Investing' | 'Trading' | 'Intraday'
    | 'Options' | 'MutualFund' | 'SIP' | 'MoneyTips' | 'PassiveIncome'
    | 'Finance' | 'Nifty' | 'BankNifty'
    | 'GraphicDesign' | 'UIUX' | 'Figma' | 'Canva' | 'Photoshop'
    | 'Illustrator' | 'LogoDesign' | 'WebDesign' | 'UIDesign' | 'Motion'
    | 'AfterEffects' | 'Business' | 'Startup' | 'Entrepreneur' | 'SideHustle'
    | 'Ecommerce' | 'Dropship' | 'DigitalMkt' | 'MakeMoney' | 'Freelance'
    | 'BusinessIdea' | 'Sales' | 'Marketing' | 'CyberSecurity' | 'Eth Hacking' | 'ComputerNetwork'
    | 'Linux' | 'IoT' | 'Robotics' | 'EmbeddedSystems'
    | 'VideoEditing' | 'FilmMaking' | 'Storytelling'
    | 'Communication'
    | 'Governance' | 'Civics' | 'Law';

export interface AddCourseFormData {
    playlistId: string;
    maxVideos: number | null;
    level: DifficultyLevel;
    category: CourseCategory;
    tags: CourseTag[];
}

export interface AddCourseApiResponse {
    message: string;
    error?: string;
}

export interface AddCourseApiRequest {
    playlistId: string;
    maxVideos: number | null;
    level: DifficultyLevel;
    category: CourseCategory;
    tags: CourseTag[];
}