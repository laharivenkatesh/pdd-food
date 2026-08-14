/**
 * Complete Database of 325 Unique, Distinct, Non-Repeated End-to-End Test Cases
 * for PDD-Food Mobile Application (Appium Automation) (Zerra Food Hub Appium Mobile Test Suite)
 */

export const testCasesDatabase = [
  // =========================================================================
  // CATEGORY 1: AUTHENTICATION & USER ONBOARDING (TC001 - TC045)
  // =========================================================================
  {
    id: "TC001",
    category: "Authentication",
    feature: "Login Form",
    elementTested: "Email Input Field",
    steps: "Navigate to /auth -> Click Login Tab -> Focus Email Input -> Type 'bunny.akki21@gmail.com'",
    expectedResult: "Email field accepts text and validates proper email string format.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC002",
    category: "Authentication",
    feature: "Login Form",
    elementTested: "Password Input Field",
    steps: "Navigate to /auth -> Focus Password Input -> Type 'Bunny123'",
    expectedResult: "Password input masks characters by default with dots or asterisks.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC003",
    category: "Authentication",
    feature: "Login Form",
    elementTested: "Show Password Toggle Button",
    steps: "Type password -> Click Eye Icon (Show Password)",
    expectedResult: "Password text converts from masked state to plain text visibility.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC004",
    category: "Authentication",
    feature: "Login Form",
    elementTested: "Hide Password Toggle Button",
    steps: "Click Eye-Off Icon (Hide Password) while password is visible",
    expectedResult: "Password text toggles back to masked dot characters.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC005",
    category: "Authentication",
    feature: "Login Form",
    elementTested: "Login Submit Button",
    steps: "Enter valid credentials ('bunny.akki21@gmail.com', 'Bunny123') -> Click 'Login' Button",
    expectedResult: "API authenticates user, stores session token, and redirects to Home marketplace.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC006",
    category: "Authentication",
    feature: "Login Validation",
    elementTested: "Empty Email Submission",
    steps: "Leave Email input blank -> Click 'Login' Button",
    expectedResult: "Displays error banner: 'Email address is required'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC007",
    category: "Authentication",
    feature: "Login Validation",
    elementTested: "Invalid Email Format",
    steps: "Enter 'bunny.akki21@invalid' in Email -> Click 'Login' Button",
    expectedResult: "Displays error banner: 'Please enter a valid email address'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC008",
    category: "Authentication",
    feature: "Login Validation",
    elementTested: "Incorrect Password Error",
    steps: "Enter 'bunny.akki21@gmail.com' and 'WrongPass999' -> Click 'Login'",
    expectedResult: "Displays alert: 'Invalid login credentials. Please try again'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC009",
    category: "Authentication",
    feature: "Forgot Password Modal",
    elementTested: "Forgot Password Link",
    steps: "Click 'Forgot Password?' link on Login tab",
    expectedResult: "Opens Password Reset modal/screen with email prompt.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC010",
    category: "Authentication",
    feature: "Forgot Password Modal",
    elementTested: "Send Reset Link Button",
    steps: "Enter 'bunny.akki21@gmail.com' in Reset Modal -> Click 'Send Reset Link'",
    expectedResult: "Displays success message: 'Password reset link sent to your email'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC011",
    category: "Authentication",
    feature: "Password Reset Screen",
    elementTested: "New Password Input",
    steps: "Navigate to reset link -> Focus 'New Password' field -> Enter 'NewBunny123'",
    expectedResult: "Field accepts new password and calculates password strength meter.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC012",
    category: "Authentication",
    feature: "Password Reset Screen",
    elementTested: "Confirm Password Input",
    steps: "Focus 'Confirm Password' field -> Enter matching 'NewBunny123'",
    expectedResult: "Match indicator displays green checkmark.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC013",
    category: "Authentication",
    feature: "Password Reset Screen",
    elementTested: "Update Password Submit Button",
    steps: "Click 'Update Password' button with valid matching passwords",
    expectedResult: "Updates password in database and redirects user to Login screen.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC014",
    category: "Authentication",
    feature: "Tab Switching",
    elementTested: "Switch to Sign Up Link",
    steps: "Click 'Don't have an account? Sign Up' link on Login form",
    expectedResult: "Switches form view smoothly to Registration / Sign Up form.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC015",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Full Name Input",
    steps: "Focus 'Full Name' input -> Enter 'Akash Bunny'",
    expectedResult: "Full name field stores typed string.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC016",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Phone Number Input",
    steps: "Focus 'Phone Number' input -> Enter '+919876543210'",
    expectedResult: "Phone number input formats numeric digits with international prefix.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC017",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Registration Email Input",
    steps: "Focus 'Email' input on Sign Up -> Enter 'bunny.newuser@gmail.com'",
    expectedResult: "Email field accepts valid address string.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC018",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Registration Password Input",
    steps: "Focus 'Create Password' field -> Enter 'SecurePass123'",
    expectedResult: "Field masks characters and updates minimum 6-character requirement indicator.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC019",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Role Picker - Student Radio",
    steps: "Click 'Student' role radio option on registration form",
    expectedResult: "'Student' role radio gets selected with active blue highlight.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC020",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Role Picker - Food Donor Radio",
    steps: "Click 'Food Donor' role radio option",
    expectedResult: "'Food Donor' radio is selected, enabling donor management features.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC021",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Role Picker - NGO Partner Radio",
    steps: "Click 'NGO Partner' role radio option",
    expectedResult: "'NGO Partner' radio gets selected.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC022",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Role Picker - Volunteer Radio",
    steps: "Click 'Volunteer' role radio option",
    expectedResult: "'Volunteer' radio gets selected.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC023",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Role Picker - Restaurant / Commercial Radio",
    steps: "Click 'Restaurant / Commercial' role radio option",
    expectedResult: "'Restaurant' radio gets selected.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC024",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Terms & Conditions Checkbox",
    steps: "Click 'I agree to Terms & Conditions' checkbox",
    expectedResult: "Checkbox toggles to checked state and enables Sign Up submission button.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC025",
    category: "Authentication",
    feature: "Sign Up Form",
    elementTested: "Sign Up Submit Button",
    steps: "Fill all mandatory signup fields -> Click 'Create Account' button",
    expectedResult: "Triggers OTP dispatch and navigates to OTP Verification screen.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC026",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Digit 1 Input Box",
    steps: "Focus 1st digit box on OTP Verification screen -> Type '1'",
    expectedResult: "Digit 1 stores '1' and automatically shifts focus to 2nd digit box.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC027",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Digit 2 Input Box",
    steps: "Type '2' in 2nd digit box",
    expectedResult: "Digit 2 stores '2' and shifts focus to 3rd digit box.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC028",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Digit 3 Input Box",
    steps: "Type '3' in 3rd digit box",
    expectedResult: "Digit 3 stores '3' and shifts focus to 4th digit box.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC029",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Digit 4 Input Box",
    steps: "Type '4' in 4th digit box",
    expectedResult: "Digit 4 stores '4' and shifts focus to 5th digit box.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC030",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Digit 5 Input Box",
    steps: "Type '5' in 5th digit box",
    expectedResult: "Digit 5 stores '5' and shifts focus to 6th digit box.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC031",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Digit 6 Input Box",
    steps: "Type '6' in 6th digit box",
    expectedResult: "Digit 6 stores '6' and enables 'Verify OTP' button.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC032",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Verify OTP Button",
    steps: "Enter '123456' -> Click 'Verify OTP' button",
    expectedResult: "Validates OTP code, marks account verified, and logs user in.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC033",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Resend OTP Button",
    steps: "Wait for 60s cooldown timer -> Click 'Resend OTP Code' button",
    expectedResult: "Dispatches fresh OTP code to user's email/phone and resets countdown timer.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC034",
    category: "Authentication",
    feature: "OTP Screen",
    elementTested: "Change Email / Phone Link",
    steps: "Click 'Change Email or Phone' link on OTP verification screen",
    expectedResult: "Returns user back to registration form with previous inputs preserved.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC035",
    category: "Authentication",
    feature: "Social Auth",
    elementTested: "Google OAuth Login Button",
    steps: "Click 'Continue with Google' button on Auth screen",
    expectedResult: "Opens Google OAuth authentication popup window.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC036",
    category: "Authentication",
    feature: "Social Auth",
    elementTested: "Facebook OAuth Login Button",
    steps: "Click 'Continue with Facebook' button on Auth screen",
    expectedResult: "Opens Facebook OAuth authentication popup window.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC037",
    category: "Authentication",
    feature: "Social Auth",
    elementTested: "Apple Sign In Button",
    steps: "Click 'Sign in with Apple' button on Auth screen",
    expectedResult: "Opens Apple ID authentication modal.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC038",
    category: "Authentication",
    feature: "Session Persistence",
    elementTested: "Auto-Login on Page Refresh",
    steps: "Login successfully -> Refresh browser tab (F5)",
    expectedResult: "User session is restored from local storage without requesting re-login.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC039",
    category: "Authentication",
    feature: "Session Persistence",
    elementTested: "Tab Reopen Session Retention",
    steps: "Close tab -> Open new browser tab -> Navigate to https://pdd-food-new.vercel.app",
    expectedResult: "User remains logged in automatically with session active.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC040",
    category: "Authentication",
    feature: "Logout Action",
    elementTested: "Manual Logout Button",
    steps: "Click User Avatar -> Click 'Logout' option",
    expectedResult: "Clears session storage, logs user out, and redirects to /auth.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC041",
    category: "Authentication",
    feature: "Protected Route",
    elementTested: "RequireAuth Guard for /post-food",
    steps: "Log out -> Try navigating directly to URL /post-food",
    expectedResult: "RequireAuth guard intercepts navigation and redirects unauthenticated user to /auth.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC042",
    category: "Authentication",
    feature: "Protected Route",
    elementTested: "RequireAuth Guard for /activity",
    steps: "Log out -> Try navigating directly to URL /activity",
    expectedResult: "Redirects unauthenticated user to /auth.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC043",
    category: "Authentication",
    feature: "Rate Limiter",
    elementTested: "OTP Request Rate Limiter Notice",
    steps: "Trigger OTP request 4 times rapidly within 60 seconds",
    expectedResult: "Displays rate limit warning: 'Too many OTP requests. Please wait 1 minute'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC044",
    category: "Authentication",
    feature: "Switch to Login",
    elementTested: "Already Have Account Link",
    steps: "Click 'Already have an account? Log In' link on Sign Up screen",
    expectedResult: "Switches view back to Login form tab.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC045",
    category: "Authentication",
    feature: "Password Confirm Validation",
    elementTested: "Sign Up Mismatched Passwords",
    steps: "Enter 'Pass123' and 'Pass456' in Sign Up -> Click 'Create Account'",
    expectedResult: "Displays error: 'Passwords do not match'.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 2: HEADER, GLOBAL NAVIGATION & MODALS (TC046 - TC080)
  // =========================================================================
  {
    id: "TC046",
    category: "Navigation",
    feature: "Navbar Header",
    elementTested: "PDD Food Brand Logo Link",
    steps: "Click 'PDD Food' brand logo in top left header while on any page",
    expectedResult: "Navigates directly back to Home Marketplace feed (/).",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC047",
    category: "Navigation",
    feature: "Navbar Header",
    elementTested: "Home Nav Item Link",
    steps: "Click 'Home' navigation link in header menu",
    expectedResult: "Navigates to Home route (/) and highlights 'Home' tab as active.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC048",
    category: "Navigation",
    feature: "Navbar Header",
    elementTested: "Activity Nav Item Link",
    steps: "Click 'Activity' navigation link in header menu",
    expectedResult: "Navigates to /activity and highlights 'Activity' tab as active.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC049",
    category: "Navigation",
    feature: "Navbar Header",
    elementTested: "Post Food Nav Item Link",
    steps: "Click 'Post Food' primary button link in header menu",
    expectedResult: "Navigates to header route /post-food form page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC050",
    category: "Navigation",
    feature: "Navbar Header",
    elementTested: "NGOs Nav Item Link",
    steps: "Click 'NGOs & Partners' navigation link in header menu",
    expectedResult: "Navigates to header route /ngos directory page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC051",
    category: "Navigation",
    feature: "Navbar Header",
    elementTested: "Expired Food Nav Item Link",
    steps: "Click 'Expired Listings' navigation link in header menu",
    expectedResult: "Navigates to header route /expired feed page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC052",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Location Picker Bar Button",
    steps: "Click Location Bar button in header ('Select City')",
    expectedResult: "Opens LocationPickerModal popup window.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC053",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Location Search Input",
    steps: "Type 'Hyderabad' into Location Search input in modal",
    expectedResult: "Filters list of cities in real time matching 'Hyderabad'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC054",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Popular City Chip - Hyderabad",
    steps: "Click 'Hyderabad' quick chip option",
    expectedResult: "Selects Hyderabad as active location and updates map coordinates.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC055",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Popular City Chip - Bengaluru",
    steps: "Click 'Bengaluru' quick chip option",
    expectedResult: "Selects Bengaluru as active location.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC056",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Popular City Chip - Mumbai",
    steps: "Click 'Mumbai' quick chip option",
    expectedResult: "Selects Mumbai as active location.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC057",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Popular City Chip - Delhi",
    steps: "Click 'Delhi' quick chip option",
    expectedResult: "Selects Delhi as active location.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC058",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Popular City Chip - Chennai",
    steps: "Click 'Chennai' quick chip option",
    expectedResult: "Selects Chennai as active location.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC059",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Use Current GPS Location Button",
    steps: "Click 'Use Current Location' button in location modal",
    expectedResult: "Requests browser geolocation permissions and sets current latitude/longitude.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC060",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Save Location Confirm Button",
    steps: "Click 'Save & Apply Location' button in modal",
    expectedResult: "Saves selected location, updates header text, closes modal, and refreshes feed.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC061",
    category: "Header Location",
    feature: "Location Picker Modal",
    elementTested: "Close / Cancel Location Modal Button",
    steps: "Click 'X' icon or 'Cancel' button on Location modal",
    expectedResult: "Closes modal without modifying current active location.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC062",
    category: "Header Search",
    feature: "Global Search Bar",
    elementTested: "Search Input Field Typing",
    steps: "Focus global search bar in header -> Type 'Biryani'",
    expectedResult: "Search input updates value and triggers debounced feed filtering.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC063",
    category: "Header Search",
    feature: "Global Search Bar",
    elementTested: "Clear Search Button (X)",
    steps: "Type 'Biryani' -> Click 'X' clear button inside search input",
    expectedResult: "Clears search text instantly and restores full food feed.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC064",
    category: "Header Search",
    feature: "Global Search Bar",
    elementTested: "Search Enter Key Trigger",
    steps: "Type 'Veg Meals' -> Press Enter key",
    expectedResult: "Executes search query and displays matching food cards.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC065",
    category: "Notifications",
    feature: "Notification Center",
    elementTested: "Notification Bell Icon Button",
    steps: "Click Bell icon in top right header",
    expectedResult: "Toggles Notification Dropdown panel open.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC066",
    category: "Notifications",
    feature: "Notification Center",
    elementTested: "Unread Badge Count Counter",
    steps: "Receive new claim notification -> Check red counter badge on Bell icon",
    expectedResult: "Badge displays accurate numeric count of unread notifications.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC067",
    category: "Notifications",
    feature: "Notification Center",
    elementTested: "Notification Filter Tab - All",
    steps: "Click 'All' filter tab inside notification panel",
    expectedResult: "Displays both read and unread notifications.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC068",
    category: "Notifications",
    feature: "Notification Center",
    elementTested: "Notification Filter Tab - Unread",
    steps: "Click 'Unread' filter tab inside notification panel",
    expectedResult: "Filters list to show unread notifications only.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC069",
    category: "Notifications",
    feature: "Notification Center",
    elementTested: "Notification Filter Tab - Claims",
    steps: "Click 'Claims' filter tab inside notification panel",
    expectedResult: "Shows claim-related notifications.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC070",
    category: "Notifications",
    feature: "Notification Center",
    elementTested: "Mark All as Read Button",
    steps: "Click 'Mark All as Read' button in notification header",
    expectedResult: "Sets all unread notifications to read status and clears bell badge count.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC071",
    category: "Notifications",
    feature: "Notification Center",
    elementTested: "Single Notification Item Click",
    steps: "Click an individual notification item in list",
    expectedResult: "Marks item read and navigates to related Food Detail / Activity claim.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC072",
    category: "Notifications",
    feature: "Notification Center",
    elementTested: "Delete Single Notification Button",
    steps: "Hover over notification item -> Click Trash icon",
    expectedResult: "Removes notification item from list.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC073",
    category: "User Menu",
    feature: "Profile Dropdown",
    elementTested: "User Avatar Menu Button",
    steps: "Click User Avatar icon in top right header",
    expectedResult: "Opens User Profile Dropdown Menu.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC074",
    category: "User Menu",
    feature: "Profile Dropdown",
    elementTested: "View Profile Item Link",
    steps: "Click 'View Profile' item in dropdown",
    expectedResult: "Navigates to user profile modal / settings page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC075",
    category: "User Menu",
    feature: "Profile Dropdown",
    elementTested: "My Active Claims Item Link",
    steps: "Click 'My Active Claims' item in dropdown",
    expectedResult: "Navigates to /activity?tab=claims.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC076",
    category: "User Menu",
    feature: "Profile Dropdown",
    elementTested: "My Posted Donations Item Link",
    steps: "Click 'My Posted Donations' item in dropdown",
    expectedResult: "Navigates to /activity?tab=donations.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC077",
    category: "User Menu",
    feature: "Profile Dropdown",
    elementTested: "Trust Score Badge Display",
    steps: "Inspect Trust Score badge in dropdown header",
    expectedResult: "Displays user trust score (e.g. 4.5 ⭐) with star ratings summary.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC078",
    category: "User Menu",
    feature: "Theme Switcher",
    elementTested: "Dark Mode Switcher Toggle",
    steps: "Click Theme Switcher toggle (Moon Icon) in dropdown",
    expectedResult: "Toggles app theme from Light mode to Dark mode.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC079",
    category: "User Menu",
    feature: "Theme Switcher",
    elementTested: "Light Mode Switcher Toggle",
    steps: "Click Theme Switcher toggle (Sun Icon) while in Dark mode",
    expectedResult: "Toggles app theme back to Light mode.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC080",
    category: "User Menu",
    feature: "Profile Dropdown",
    elementTested: "Dropdown Backdrop Close",
    steps: "Click outside dropdown menu on background overlay",
    expectedResult: "Closes profile dropdown menu.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 3: HOME PAGE MARKETPLACE & FEED (TC081 - TC125)
  // =========================================================================
  {
    id: "TC081",
    category: "Home Feed",
    feature: "Hero Banner",
    elementTested: "Donate Food Now CTA Button",
    steps: "Click 'Donate Food Now' primary button on Home Hero banner",
    expectedResult: "Navigates to /post-food page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC082",
    category: "Home Feed",
    feature: "Hero Banner",
    elementTested: "Browse Available Food CTA Button",
    steps: "Click 'Browse Available Food' secondary button on Hero banner",
    expectedResult: "Smoothly scrolls down page to food marketplace listings section.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC083",
    category: "Home Feed",
    feature: "Purpose Filter Chips",
    elementTested: "All Purpose Chip",
    steps: "Click 'All Purpose' filter chip above food feed",
    expectedResult: "Displays food listings for both human and animal consumption.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC084",
    category: "Home Feed",
    feature: "Purpose Filter Chips",
    elementTested: "For Humans Chip",
    steps: "Click 'For Humans 👤' purpose filter chip",
    expectedResult: "Filters feed to display listings suitable for human consumption only.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC085",
    category: "Home Feed",
    feature: "Purpose Filter Chips",
    elementTested: "For Animals Chip",
    steps: "Click 'For Animals 🐾' purpose filter chip",
    expectedResult: "Filters feed to display listings for dogs, pets, and animal shelters.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC086",
    category: "Home Feed",
    feature: "Purpose Filter Chips",
    elementTested: "Both Purpose Chip",
    steps: "Click 'Both (Humans & Animals) 🔄' filter chip",
    expectedResult: "Displays listings tagged as versatile for both humans and animals.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC087",
    category: "Home Feed",
    feature: "Category Filter Chips",
    elementTested: "All Categories Chip",
    steps: "Click 'All Categories' chip",
    expectedResult: "Displays food items across all food categories.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC088",
    category: "Home Feed",
    feature: "Category Filter Chips",
    elementTested: "Veg Food Chip",
    steps: "Click 'Veg 🥦' category filter chip",
    expectedResult: "Filters food listings to vegetarian items only.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC089",
    category: "Home Feed",
    feature: "Category Filter Chips",
    elementTested: "Non-Veg Food Chip",
    steps: "Click 'Non-Veg 🍗' category filter chip",
    expectedResult: "Filters food listings to non-vegetarian items.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC090",
    category: "Home Feed",
    feature: "Category Filter Chips",
    elementTested: "Bakery Chip",
    steps: "Click 'Bakery 🍞' category filter chip",
    expectedResult: "Filters feed to bread, pastries, and bakery items.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC091",
    category: "Home Feed",
    feature: "Category Filter Chips",
    elementTested: "Fried Food Chip",
    steps: "Click 'Fried 🍟' category filter chip",
    expectedResult: "Filters feed to snacks and fried food items.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC092",
    category: "Home Feed",
    feature: "Category Filter Chips",
    elementTested: "Sweets Chip",
    steps: "Click 'Sweets 🍰' category filter chip",
    expectedResult: "Filters feed to desserts and sweet items.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC093",
    category: "Home Feed",
    feature: "Realtime Status Filter",
    elementTested: "Still Available Status Filter",
    steps: "Select 'Still Available' status radio filter",
    expectedResult: "Displays food items with > 2 hours remaining before expiry.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC094",
    category: "Home Feed",
    feature: "Realtime Status Filter",
    elementTested: "Almost Gone Status Filter",
    steps: "Select 'Almost Gone' status radio filter",
    expectedResult: "Displays urgent food items with < 1 hour remaining before expiry.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC095",
    category: "Home Feed",
    feature: "Pricing Filter",
    elementTested: "Free Food Donations Checkbox",
    steps: "Check 'Free Food Donations Only' checkbox filter",
    expectedResult: "Filters feed to items priced at ₹0.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC096",
    category: "Home Feed",
    feature: "Pricing Filter",
    elementTested: "Discounted Surplus Checkbox",
    steps: "Check 'Discounted Surplus Food Only' checkbox filter",
    expectedResult: "Filters feed to discounted items with prices > ₹0.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC097",
    category: "Home Feed",
    feature: "Distance Radius Slider",
    elementTested: "1 km Radius Stepper",
    steps: "Click '1 km' distance radius option",
    expectedResult: "Filters listings located within 1 km distance from user location.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC098",
    category: "Home Feed",
    feature: "Distance Radius Slider",
    elementTested: "5 km Radius Stepper",
    steps: "Click '5 km' distance radius option",
    expectedResult: "Filters listings within 5 km radius.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC099",
    category: "Home Feed",
    feature: "Distance Radius Slider",
    elementTested: "10 km Radius Stepper",
    steps: "Click '10 km' distance radius option",
    expectedResult: "Filters listings within 10 km radius.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC100",
    category: "Home Feed",
    feature: "Distance Radius Slider",
    elementTested: "20 km Radius Stepper",
    steps: "Click '20 km' distance radius option",
    expectedResult: "Expands listings search radius up to 20 km.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC101",
    category: "Home Feed",
    feature: "Sort Options",
    elementTested: "Sort Dropdown - Nearest First",
    steps: "Select 'Nearest First' in Sort Dropdown",
    expectedResult: "Sorts food cards by closest geographical distance.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC102",
    category: "Home Feed",
    feature: "Sort Options",
    elementTested: "Sort Dropdown - Expiring Soonest",
    steps: "Select 'Expiring Soonest' in Sort Dropdown",
    expectedResult: "Sorts food cards by shortest remaining expiry time.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC103",
    category: "Home Feed",
    feature: "Sort Options",
    elementTested: "Sort Dropdown - Highest Rated Donor",
    steps: "Select 'Highest Rated Donor' in Sort Dropdown",
    expectedResult: "Sorts listings by donor trust score rating.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC104",
    category: "Home Feed",
    feature: "Sort Options",
    elementTested: "Sort Dropdown - Most Servings Available",
    steps: "Select 'Most Servings Available' in Sort Dropdown",
    expectedResult: "Sorts listings by total available portion quantity.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC105",
    category: "Home Feed",
    feature: "View Toggle",
    elementTested: "Grid View Mode Button",
    steps: "Click Grid View icon button",
    expectedResult: "Displays food listings in 3-column responsive card grid layout.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC106",
    category: "Home Feed",
    feature: "View Toggle",
    elementTested: "Map View Mode Button",
    steps: "Click Map View icon button",
    expectedResult: "Renders interactive map view displaying pins for all nearby food listings.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC107",
    category: "Home Feed",
    feature: "Map Marker Pin",
    elementTested: "Interactive Map Marker Click",
    steps: "Click a food pin on Map View",
    expectedResult: "Opens popup preview card showing title, servings, and 'Reserve' CTA.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC108",
    category: "Home Feed",
    feature: "Reset Filters",
    elementTested: "Clear All Filters Button",
    steps: "Apply category, distance, and price filters -> Click 'Clear All Filters' button",
    expectedResult: "Resets all filters to default state and restores complete food feed.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC109",
    category: "Home Feed",
    feature: "Feed Pagination",
    elementTested: "Load More Listings Button",
    steps: "Scroll to bottom of food feed -> Click 'Load More Food Items' button",
    expectedResult: "Fetches and appends next batch of food listings to grid.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC110",
    category: "Home Feed",
    feature: "Empty Feed State",
    elementTested: "No Results Matching Filter Message",
    steps: "Apply search 'XYZNonExistentFood999'",
    expectedResult: "Displays empty state card: 'No food items found matching your filter criteria'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC111",
    category: "Home Feed",
    feature: "Empty Feed State",
    elementTested: "Reset Search CTA Button",
    steps: "Click 'Reset Search' button on Empty State card",
    expectedResult: "Clears search input and reloads food listings.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC112",
    category: "Home Feed",
    feature: "Feed Pull to Refresh",
    elementTested: "Refresh Feed Trigger Button",
    steps: "Click 'Refresh Feed 🔄' icon above food grid",
    expectedResult: "Refetches latest listings from server with updated countdowns.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC113",
    category: "Home Feed",
    feature: "Banner Announcements",
    elementTested: "Emergency Food Relief Banner CTA",
    steps: "Click 'View Emergency Relief Drives' banner link",
    expectedResult: "Navigates to emergency food relief NGO section.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC114",
    category: "Home Feed",
    feature: "Banner Announcements",
    elementTested: "Banner Dismiss Button (X)",
    steps: "Click 'X' dismiss button on announcement banner",
    expectedResult: "Hides announcement banner for current session.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC115",
    category: "Home Feed",
    feature: "Quick Stats Bar",
    elementTested: "Total Meals Shared Counter",
    steps: "Inspect 'Total Meals Shared' metric card",
    expectedResult: "Displays live count of meals shared by community.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC116",
    category: "Home Feed",
    feature: "Quick Stats Bar",
    elementTested: "Active Donors Count",
    steps: "Inspect 'Active Donors' metric card",
    expectedResult: "Displays number of verified active donors.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC117",
    category: "Home Feed",
    feature: "Quick Stats Bar",
    elementTested: "CO2 Emissions Saved Metric",
    steps: "Inspect 'CO2 Saved' environmental impact card",
    expectedResult: "Displays estimated CO2 emissions prevented from food waste.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC118",
    category: "Home Feed",
    feature: "Feed Item Counter",
    elementTested: "Available Items Summary Header",
    steps: "Inspect header text above food cards ('Showing 12 items nearby')",
    expectedResult: "Displays accurate total count of filtered listings.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC119",
    category: "Home Feed",
    feature: "Food Card Badge",
    elementTested: "Verified Donor Badge Indicator",
    steps: "Inspect card for donor with verified badge",
    expectedResult: "Displays green checkmark shield icon indicating verified donor.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC120",
    category: "Home Feed",
    feature: "Food Card Badge",
    elementTested: "Split Portion Allowed Chip",
    steps: "Inspect card where portion splitting is enabled",
    expectedResult: "Displays 'Split Portions Allowed' badge.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC121",
    category: "Home Feed",
    feature: "Food Card Badge",
    elementTested: "Safe for Pets Badge",
    steps: "Inspect food card tagged safe for animals",
    expectedResult: "Displays '🐾 Safe for Pets' badge.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC122",
    category: "Home Feed",
    feature: "Quick Action",
    elementTested: "Instant Claim Single Portion Button",
    steps: "Click 'Instant Claim' quick button on card footer",
    expectedResult: "Opens quick claim confirmation drawer.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC123",
    category: "Home Feed",
    feature: "Filter Preset",
    elementTested: "Save Current Filter Preset Button",
    steps: "Apply custom filters -> Click 'Save Filter Preset' button",
    expectedResult: "Saves filter combination to user settings for 1-click access.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC124",
    category: "Home Feed",
    feature: "Filter Preset",
    elementTested: "Apply Saved Filter Preset Link",
    steps: "Click 'My Saved Filters' dropdown -> Select 'Veg Near Me'",
    expectedResult: "Applies saved filter parameters automatically.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC125",
    category: "Home Feed",
    feature: "Footer Link",
    elementTested: "Back to Top Scroll Floating Button",
    steps: "Scroll down 1500px -> Click floating 'Back to Top ⬆️' button",
    expectedResult: "Smoothly scrolls viewport back to top header.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 4: FOOD CARD COMPONENT & ACTIONS (TC126 - TC165)
  // =========================================================================
  {
    id: "TC126",
    category: "Food Card",
    feature: "Card Image",
    elementTested: "Food Thumbnail Image Click",
    steps: "Click food item thumbnail image on Food Card",
    expectedResult: "Navigates to Food Detail view page (/food/:id).",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC127",
    category: "Food Card",
    feature: "Card Title",
    elementTested: "Food Item Title Link",
    steps: "Click food item title heading text",
    expectedResult: "Navigates to Food Detail page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC128",
    category: "Food Card",
    feature: "Live Countdown Component",
    elementTested: "Live Countdown Timer Ticker",
    steps: "Observe LiveCountdown component on Food Card for 10 seconds",
    expectedResult: "Timer decrements seconds dynamically (e.g. 01h : 45m : 30s -> 01h : 45m : 20s).",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC129",
    category: "Food Card",
    feature: "Live Countdown Component",
    elementTested: "Urgent Countdown Color Alert",
    steps: "Inspect food card with < 30 mins remaining",
    expectedResult: "Countdown text turns red with flashing urgency pulse.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC130",
    category: "Food Card",
    feature: "Servings Badge",
    elementTested: "Servings Count Badge Display",
    steps: "Inspect Servings Counter pill (e.g. '10 Servings Left')",
    expectedResult: "Displays exact number of remaining unclaimed portions.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC131",
    category: "Food Card",
    feature: "Price Tag",
    elementTested: "Free Price Tag Badge",
    steps: "Inspect card for ₹0 item",
    expectedResult: "Displays green 'FREE' pill badge.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC132",
    category: "Food Card",
    feature: "Price Tag",
    elementTested: "Discounted Price Tag Badge",
    steps: "Inspect card for discounted item",
    expectedResult: "Displays price (e.g. '₹49 (50% OFF)').",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC133",
    category: "Food Card",
    feature: "Location Badge",
    elementTested: "Distance Badge Click",
    steps: "Click distance text (e.g. '1.2 km away') on Food Card",
    expectedResult: "Opens map preview showing pickup location.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC134",
    category: "Food Card",
    feature: "Card Action",
    elementTested: "Reserve Portion Button",
    steps: "Click 'Reserve Portion' primary button on Food Card",
    expectedResult: "Opens portion reservation modal or redirects to booking flow.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC135",
    category: "Food Card",
    feature: "Card Action",
    elementTested: "View Details Button",
    steps: "Click 'View Details' secondary button on Food Card",
    expectedResult: "Opens dedicated detail view for the clicked food listing.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC136",
    category: "Food Card",
    feature: "Card Action",
    elementTested: "Bookmark / Favorite Heart Toggle",
    steps: "Click Heart icon on top right of Food Card",
    expectedResult: "Toggles heart to filled red state and adds item to saved favorites.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC137",
    category: "Food Card",
    feature: "Card Action",
    elementTested: "Remove Favorite Heart Toggle",
    steps: "Click filled Heart icon on favorited card",
    expectedResult: "Toggles heart back to outline state and removes item from saved favorites.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC138",
    category: "Food Card",
    feature: "Social Share",
    elementTested: "Share Listing Icon Button",
    steps: "Click Share icon button on Food Card",
    expectedResult: "Opens native share sheet / options modal (Copy Link, WhatsApp, Twitter).",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC139",
    category: "Food Card",
    feature: "Social Share",
    elementTested: "Copy Link Share Option",
    steps: "Click 'Copy Link' option in Share modal",
    expectedResult: "Copies listing URL to clipboard and shows 'Link copied!' toast.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC140",
    category: "Food Card",
    feature: "Social Share",
    elementTested: "WhatsApp Share Option",
    steps: "Click 'Share via WhatsApp' button",
    expectedResult: "Opens WhatsApp URL with pre-filled food title and link.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC141",
    category: "Food Card",
    feature: "Donor Profile",
    elementTested: "Donor Name Click",
    steps: "Click Donor Name link on Food Card footer",
    expectedResult: "Opens Donor Public Profile modal showing ratings and history.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC142",
    category: "Food Card",
    feature: "Donor Profile",
    elementTested: "Donor Rating Stars Display",
    steps: "Inspect star rating on card footer (e.g. 4.8 ⭐)",
    expectedResult: "Displays donor's average trust score rating.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC143",
    category: "Food Card",
    feature: "Preparation Time",
    elementTested: "Cooked Time Timestamp Display",
    steps: "Inspect 'Prepared at 2:30 PM' timestamp label",
    expectedResult: "Shows when food was freshly cooked.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC144",
    category: "Food Card",
    feature: "Food Type Indicator",
    elementTested: "Veg Green Dot Badge",
    steps: "Inspect Veg food item",
    expectedResult: "Displays standard green dot in green square Veg symbol.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC145",
    category: "Food Card",
    feature: "Food Type Indicator",
    elementTested: "Non-Veg Red Dot Badge",
    steps: "Inspect Non-Veg food item",
    expectedResult: "Displays red dot in red square Non-Veg symbol.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC146",
    category: "Food Card",
    feature: "Claim Status",
    elementTested: "Fully Reserved Disabled Button",
    steps: "Inspect card with 0 remaining portions",
    expectedResult: "Disables 'Reserve' button and displays 'Fully Claimed' status badge.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC147",
    category: "Food Card",
    feature: "Claim Status",
    elementTested: "Expired Listing Overlay",
    steps: "Inspect listing whose countdown reached 0",
    expectedResult: "Displays grayed out 'Listing Expired' overlay.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC148",
    category: "Food Card",
    feature: "Quick Preview",
    elementTested: "Hover Image Magnifier / Preview",
    steps: "Hover mouse over food card image on Web",
    expectedResult: "Displays subtle zoom animation preview.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC149",
    category: "Food Card",
    feature: "Quick Action",
    elementTested: "Report Listing Icon Button",
    steps: "Click 3-dots menu on card -> Click 'Report Listing'",
    expectedResult: "Opens quick card action report submission modal.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC150",
    category: "Food Card",
    feature: "Report Modal",
    elementTested: "Report Reason Radio - Expired Food",
    steps: "Select 'Expired or Spoiled Food' reason in Report modal",
    expectedResult: "Expired or spoiled food radio option becomes selected.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC151",
    category: "Food Card",
    feature: "Report Modal",
    elementTested: "Report Reason Radio - Wrong Location",
    steps: "Select 'Incorrect Location Address' reason",
    expectedResult: "Incorrect location address radio option becomes selected.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC152",
    category: "Food Card",
    feature: "Report Modal",
    elementTested: "Submit Report Button",
    steps: "Click 'Submit Report' button",
    expectedResult: "Submits report to moderators and displays confirmation toast.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC153",
    category: "Food Card",
    feature: "Dietary Tag",
    elementTested: "Gluten-Free Tag Chip",
    steps: "Inspect food card tagged Gluten-Free",
    expectedResult: "Displays 'Gluten-Free' chip.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC154",
    category: "Food Card",
    feature: "Dietary Tag",
    elementTested: "Nut-Free Tag Chip",
    steps: "Inspect food card tagged Nut-Free",
    expectedResult: "Displays 'Nut-Free' chip.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC155",
    category: "Food Card",
    feature: "Dietary Tag",
    elementTested: "Halal Certified Tag Chip",
    steps: "Inspect food card tagged Halal",
    expectedResult: "Displays 'Halal' chip.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC156",
    category: "Food Card",
    feature: "Packaging Type",
    elementTested: "Packed in Sealed Containers Badge",
    steps: "Inspect card packaging info",
    expectedResult: "Displays 'Sealed Containers' badge.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC157",
    category: "Food Card",
    feature: "Pickup Window",
    elementTested: "Pickup Time Slot Pill",
    steps: "Inspect 'Pickup: 4 PM - 6 PM' label on card",
    expectedResult: "Displays available pickup window.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC158",
    category: "Food Card",
    feature: "Distance Indicator",
    elementTested: "Walking Distance Icon Highlight",
    steps: "Inspect listing < 500 meters away",
    expectedResult: "Displays green walking icon (e.g. '🚶 5 mins walk').",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC159",
    category: "Food Card",
    feature: "Card Badge",
    elementTested: "Featured / Urgent Boosted Ribbon",
    steps: "Inspect urgent food listing",
    expectedResult: "Displays top banner ribbon: '🔥 Urgent Donation'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC160",
    category: "Food Card",
    feature: "Card Keyboard Nav",
    elementTested: "Tab Keyboard Navigation Selection",
    steps: "Press Tab key to focus Food Card",
    expectedResult: "Displays visible blue focus ring around active card.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC161",
    category: "Food Card",
    feature: "Card Keyboard Nav",
    elementTested: "Enter Key Open Details Trigger",
    steps: "Press Enter key while card is focused",
    expectedResult: "Triggers keyboard navigation to Food Detail view.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC162",
    category: "Food Card",
    feature: "Quantity Left Badge",
    elementTested: "Single Portion Warning Pill",
    steps: "Inspect listing with only 1 portion left",
    expectedResult: "Displays amber pill: 'Only 1 Portion Left!'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC163",
    category: "Food Card",
    feature: "Donor Verification",
    elementTested: "Super Donor Gold Shield Icon",
    steps: "Inspect card from donor with > 50 successful donations",
    expectedResult: "Displays gold 'Super Donor' badge.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC164",
    category: "Food Card",
    feature: "Quick Directions",
    elementTested: "Get Directions Button Click",
    steps: "Click 'Directions 🧭' icon on card",
    expectedResult: "Opens Google Maps directions in new tab.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC165",
    category: "Food Card",
    feature: "Card Animation",
    elementTested: "Card Mount Fade-In Animation",
    steps: "Load food feed page",
    expectedResult: "Cards render with smooth stagger fade-in animation.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 5: FOOD DETAIL & RESERVATION FLOW (TC166 - TC200)
  // =========================================================================
  {
    id: "TC166",
    category: "Food Detail",
    feature: "Navigation",
    elementTested: "Back to Feed Button",
    steps: "Click '< Back to Feed' button at top of Food Detail page",
    expectedResult: "Navigates back to Home marketplace page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC167",
    category: "Food Detail",
    feature: "Image Gallery",
    elementTested: "Gallery Main Banner Image",
    steps: "Click main food image banner on detail page",
    expectedResult: "Opens full-screen lightbox image viewer.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC168",
    category: "Food Detail",
    feature: "Image Gallery",
    elementTested: "Gallery Thumbnail Switcher",
    steps: "Click 2nd thumbnail image in gallery preview",
    expectedResult: "Swaps main display banner to selected 2nd image.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC169",
    category: "Food Detail",
    feature: "Expiry Timer",
    elementTested: "Detail Page Live Countdown Timer",
    steps: "Inspect live expiry timer on Detail page header",
    expectedResult: "Displays active countdown with hours, minutes, and seconds.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC170",
    category: "Food Detail",
    feature: "Item Attributes",
    elementTested: "Category Badge Display",
    steps: "Inspect Category attribute (e.g. 'Category: Bakery')",
    expectedResult: "Displays category icon and title.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC171",
    category: "Food Detail",
    feature: "Item Attributes",
    elementTested: "Total Servings Badge",
    steps: "Inspect Total Servings counter (e.g. '15 Portions Available')",
    expectedResult: "Shows total servings initially posted vs remaining.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC172",
    category: "Food Detail",
    feature: "Item Attributes",
    elementTested: "Preparation Date/Time Stamp",
    steps: "Inspect 'Cooked Date & Time' section",
    expectedResult: "Displays exact timestamp when food was prepared.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC173",
    category: "Food Detail",
    feature: "Donor Profile Card",
    elementTested: "Donor Name & Avatar Card",
    steps: "Inspect Donor profile widget on right panel",
    expectedResult: "Displays Donor avatar image, full name, and verified badge.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC174",
    category: "Food Detail",
    feature: "Donor Profile Card",
    elementTested: "Donor Rating Score",
    steps: "Inspect Star rating widget (e.g. 4.9 ⭐ out of 5)",
    expectedResult: "Displays donor overall rating score and review count.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC175",
    category: "Food Detail",
    feature: "Donor Action",
    elementTested: "Contact Donor Phone Icon Button",
    steps: "Click 'Contact Donor' phone button",
    expectedResult: "Displays donor phone number overlay / call prompt.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC176",
    category: "Food Detail",
    feature: "Donor Action",
    elementTested: "Send WhatsApp Message Button",
    steps: "Click 'Message via WhatsApp' button",
    expectedResult: "Launches WhatsApp with automated query message.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC177",
    category: "Food Detail",
    feature: "Pickup Location",
    elementTested: "Address Location Box",
    steps: "Inspect Pickup Address text box",
    expectedResult: "Displays formatted address details and landmark notes.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC178",
    category: "Food Detail",
    feature: "Interactive Map",
    elementTested: "MapPreview Interactive Widget",
    steps: "Interact with MapPreview widget (zoom/pan)",
    expectedResult: "Renders interactive map centered on pickup location pin.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC179",
    category: "Food Detail",
    feature: "Interactive Map",
    elementTested: "Open in Google Maps Button",
    steps: "Click 'Open in Google Maps 🗺️' link",
    expectedResult: "Opens Google Maps location in new browser tab.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC180",
    category: "Reservation Flow",
    feature: "Portion Stepper",
    elementTested: "Portion Stepper Plus (+) Button",
    steps: "Click Plus (+) button next to portion count",
    expectedResult: "Increments portion reservation quantity from 1 to 2.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC181",
    category: "Reservation Flow",
    feature: "Portion Stepper",
    elementTested: "Portion Stepper Minus (-) Button",
    steps: "Click Minus (-) button when quantity is 2",
    expectedResult: "Decrements portion reservation quantity back to 1.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC182",
    category: "Reservation Flow",
    feature: "Portion Stepper",
    elementTested: "Minimum Limit Enforcement (1)",
    steps: "Click Minus (-) button when quantity is 1",
    expectedResult: "Keeps quantity at minimum limit 1 and disables Minus button.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC183",
    category: "Reservation Flow",
    feature: "Portion Stepper",
    elementTested: "Maximum Limit Enforcement",
    steps: "Click Plus (+) button until max available portions is reached",
    expectedResult: "Disables Plus (+) button when reaching total available remaining portions.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC184",
    category: "Reservation Flow",
    feature: "Portion Input",
    elementTested: "Direct Number Quantity Input",
    steps: "Focus portion quantity input box -> Type '3'",
    expectedResult: "Updates portion count directly to 3.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC185",
    category: "Reservation Flow",
    feature: "Claim Action",
    elementTested: "Reserve Portions Main CTA Button",
    steps: "Click 'Reserve 2 Portions' primary CTA button",
    expectedResult: "Opens Claim Confirmation Modal.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC186",
    category: "Reservation Flow",
    feature: "Claim Modal",
    elementTested: "Claim Modal Pickup Time Slot Picker",
    steps: "Select '4:30 PM - 5:00 PM' time slot in Claim modal",
    expectedResult: "Selects pickup time window.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC187",
    category: "Reservation Flow",
    feature: "Claim Modal",
    elementTested: "Claim Modal Notes Textarea",
    steps: "Type 'Will arrive in 20 mins with container' in Notes input",
    expectedResult: "Stores pickup notes for donor.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC188",
    category: "Reservation Flow",
    feature: "Claim Modal",
    elementTested: "Confirm Reservation Submit Button",
    steps: "Click 'Confirm & Generate Pickup Pass' button in modal",
    expectedResult: "Deducts 2 portions, generates unique 6-digit Claim Code (e.g. #CLM-8492), displays success alert.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC189",
    category: "Reservation Flow",
    feature: "Claim Modal",
    elementTested: "Claim Success Screen Code Display",
    steps: "Inspect success modal screen",
    expectedResult: "Displays 6-digit Claim PIN code and QR code for pickup.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC190",
    category: "Reservation Flow",
    feature: "Claim Modal",
    elementTested: "View My Claims Navigation Button",
    steps: "Click 'View My Claims' button on success screen",
    expectedResult: "Navigates to /activity route with active claim highlighted.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC191",
    category: "Reservation Flow",
    feature: "Claim Modal",
    elementTested: "Close Success Screen Button",
    steps: "Click 'Done' button on success screen",
    expectedResult: "Closes modal and updates remaining portions counter on Food Detail page.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC192",
    category: "Food Detail",
    feature: "Special Instructions",
    elementTested: "Donor Special Notes Card",
    steps: "Inspect 'Special Instructions from Donor' section",
    expectedResult: "Displays donor notes (e.g. 'Please bring clean containers').",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC193",
    category: "Food Detail",
    feature: "Allergen Warning",
    elementTested: "Allergen Information Box",
    steps: "Inspect Allergen notice (e.g. 'Contains Dairy and Nuts')",
    expectedResult: "Displays amber allergen warning badge.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC194",
    category: "Food Detail",
    feature: "Social Share",
    elementTested: "Detail Page Share Button",
    steps: "Click 'Share Food' button on detail page toolbar",
    expectedResult: "Opens social share options popup.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC195",
    category: "Food Detail",
    feature: "Bookmark",
    elementTested: "Detail Page Bookmark Button",
    steps: "Click 'Save Listing' heart icon on detail page toolbar",
    expectedResult: "Toggles item saved state and adds to user saved list.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC196",
    category: "Food Detail",
    feature: "Related Items",
    elementTested: "Similar Food Items Carousel",
    steps: "Scroll to bottom of detail page -> Inspect 'More Food Items Nearby'",
    expectedResult: "Displays carousel of 3 similar nearby food listings.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC197",
    category: "Food Detail",
    feature: "Related Items",
    elementTested: "Related Food Card Click",
    steps: "Click a food card in 'Similar Food Items' carousel",
    expectedResult: "Navigates to selected food item detail page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC198",
    category: "Reservation Flow",
    feature: "Claim Cancel",
    elementTested: "Cancel Modal Button",
    steps: "Click 'Cancel' button in reservation modal before confirming",
    expectedResult: "Closes modal without creating claim or modifying portion inventory.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC199",
    category: "Reservation Flow",
    feature: "Inventory Sync",
    elementTested: "Zero Quantity Out of Stock State",
    steps: "Reserve remaining portions until count becomes 0",
    expectedResult: "Disables 'Reserve Portion' CTA and updates status to 'Fully Reserved'.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC200",
    category: "Food Detail",
    feature: "Report Button",
    elementTested: "Report Listing Button",
    steps: "Click 'Report Item' link at bottom of detail page",
    expectedResult: "Opens detail view item report submission modal.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 6: REVIEW & RATING SYSTEM (TC201 - TC225)
  // =========================================================================
  {
    id: "TC201",
    category: "Reviews",
    feature: "Review Section",
    elementTested: "Donor Review Section Scroll",
    steps: "Scroll down to 'Ratings & Reviews' section on Food Detail / Donor Profile",
    expectedResult: "Renders review breakdown widget and customer review list.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC202",
    category: "Reviews",
    feature: "Rating Summary",
    elementTested: "Overall Rating Score Display",
    steps: "Inspect large rating score number (e.g. '4.8 out of 5')",
    expectedResult: "Displays overall average donor rating score.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC203",
    category: "Reviews",
    feature: "Rating Summary",
    elementTested: "Rating Distribution Bar - 5 Stars",
    steps: "Inspect 5-star progress bar in rating summary",
    expectedResult: "Displays percentage bar for 5-star reviews.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC204",
    category: "Reviews",
    feature: "Rating Summary",
    elementTested: "Rating Distribution Bar - 4 Stars",
    steps: "Inspect 4-star progress bar",
    expectedResult: "Displays percentage bar for 4-star reviews.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC205",
    category: "Reviews",
    feature: "Rating Summary",
    elementTested: "Rating Distribution Bar - 3 Stars",
    steps: "Inspect 3-star progress bar",
    expectedResult: "Displays percentage bar for 3-star reviews.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC206",
    category: "Reviews",
    feature: "Rating Summary",
    elementTested: "Rating Distribution Bar - 2 Stars",
    steps: "Inspect 2-star progress bar",
    expectedResult: "Displays percentage bar for 2-star reviews.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC207",
    category: "Reviews",
    feature: "Rating Summary",
    elementTested: "Rating Distribution Bar - 1 Star",
    steps: "Inspect 1-star progress bar",
    expectedResult: "Displays percentage bar for 1-star reviews.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC208",
    category: "Reviews",
    feature: "Review Filter",
    elementTested: "Filter Chip - All Reviews",
    steps: "Click 'All Reviews' filter chip",
    expectedResult: "Displays all reviews regardless of rating score.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC209",
    category: "Reviews",
    feature: "Review Filter",
    elementTested: "Filter Chip - 5 Stars Only",
    steps: "Click '5 Stars ⭐️' filter chip",
    expectedResult: "Filters review list to 5-star reviews only.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC210",
    category: "Reviews",
    feature: "Review Filter",
    elementTested: "Filter Chip - Critical Reviews (1-2 Stars)",
    steps: "Click '1-2 Stars ⚠️' filter chip",
    expectedResult: "Filters list to critical reviews.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC211",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Write a Review CTA Button",
    steps: "Click 'Write a Review' button",
    expectedResult: "Opens Review Submission Modal.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC212",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Star Rating Selector - 1 Star Click",
    steps: "Click 1st Star in rating picker",
    expectedResult: "Sets rating to 1 Star and highlights star yellow.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC213",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Star Rating Selector - 2 Stars Click",
    steps: "Click 2nd Star in rating picker",
    expectedResult: "Sets rating to 2 Stars.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC214",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Star Rating Selector - 3 Stars Click",
    steps: "Click 3rd Star in rating picker",
    expectedResult: "Sets rating to 3 Stars.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC215",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Star Rating Selector - 4 Stars Click",
    steps: "Click 4th Star in rating picker",
    expectedResult: "Sets rating to 4 Stars.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC216",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Star Rating Selector - 5 Stars Click",
    steps: "Click 5th Star in rating picker",
    expectedResult: "Sets rating to 5 Stars (Excellent).",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC217",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Review Comment Textarea Input",
    steps: "Focus Review Comment textarea -> Type 'Fresh food, polite donor, smooth pickup!'",
    expectedResult: "Textarea accepts comment and updates character count (44/500).",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC218",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Upload Review Photo Button",
    steps: "Click 'Attach Photo' button in review modal -> Select image",
    expectedResult: "Attaches photo thumbnail preview to review form.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC219",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Remove Review Photo Button",
    steps: "Click 'X' icon on photo preview thumbnail",
    expectedResult: "Removes attached photo from review.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC220",
    category: "Reviews",
    feature: "Write Review Modal",
    elementTested: "Submit Review Button",
    steps: "Click 'Submit Review' button with 5 stars and text",
    expectedResult: "Submits review to database, appends to review list, and updates donor average rating.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC221",
    category: "Reviews",
    feature: "Review Action",
    elementTested: "Helpful / Upvote Review Button",
    steps: "Click 'Helpful 👍 (3)' button on a review card",
    expectedResult: "Increments helpful upvote count from 3 to 4.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC222",
    category: "Reviews",
    feature: "Review Action",
    elementTested: "Flag / Report Review Button",
    steps: "Click 'Flag Review' 3-dots option on a review item",
    expectedResult: "Opens review report dialog.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC223",
    category: "Reviews",
    feature: "Review List",
    elementTested: "Reviewer Avatar & Name Display",
    steps: "Inspect review list item",
    expectedResult: "Displays reviewer name, avatar, and date posted.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC224",
    category: "Reviews",
    feature: "Review List",
    elementTested: "Verified Pickup Badge",
    steps: "Inspect review item from user who completed claim",
    expectedResult: "Displays 'Verified Recipient' green badge.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC225",
    category: "Reviews",
    feature: "Review Modal",
    elementTested: "Close Review Modal Button",
    steps: "Click 'Cancel / Close' button on Review modal",
    expectedResult: "Closes modal without submitting draft review.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 7: POST FOOD / CREATE LISTING FORM (TC226 - TC265)
  // =========================================================================
  {
    id: "TC226",
    category: "Post Food",
    feature: "Post Food Form",
    elementTested: "Post Food Navigation Link",
    steps: "Click 'Post Food' in header navigation bar",
    expectedResult: "Directs browser URL to the /post-food donation creation form.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC227",
    category: "Post Food",
    feature: "Listing Type Select",
    elementTested: "Free Food Donation Radio Option",
    steps: "Click 'Free Food Donation (₹0)' radio option",
    expectedResult: "Selects Free Donation mode and disables price input field.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC228",
    category: "Post Food",
    feature: "Listing Type Select",
    elementTested: "Discounted Surplus Food Radio Option",
    steps: "Click 'Discounted Surplus Food' radio option",
    expectedResult: "Selects Discounted mode and enables numeric price input field.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC229",
    category: "Post Food",
    feature: "Title Input",
    elementTested: "Food Title Input Field",
    steps: "Focus 'Food Item Title' input -> Type 'Fresh Vegetable Biryani & Raita'",
    expectedResult: "Title field accepts text and updates character counter (31/100).",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC230",
    category: "Post Food",
    feature: "Category Select",
    elementTested: "Category Dropdown Select - Veg",
    steps: "Click Category dropdown -> Select 'Veg'",
    expectedResult: "Selects 'Veg' as food category.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC231",
    category: "Post Food",
    feature: "Category Select",
    elementTested: "Category Dropdown Select - Non-Veg",
    steps: "Select 'Non-Veg'",
    expectedResult: "Selects 'Non-Veg' category.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC232",
    category: "Post Food",
    feature: "Category Select",
    elementTested: "Category Dropdown Select - Bakery",
    steps: "Select 'Bakery'",
    expectedResult: "Selects 'Bakery' category.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC233",
    category: "Post Food",
    feature: "Category Select",
    elementTested: "Category Dropdown Select - Fried",
    steps: "Select 'Fried'",
    expectedResult: "Selects 'Fried' category.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC234",
    category: "Post Food",
    feature: "Category Select",
    elementTested: "Category Dropdown Select - Sweets",
    steps: "Select 'Sweets'",
    expectedResult: "Selects 'Sweets' category.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC235",
    category: "Post Food",
    feature: "Quantity Stepper",
    elementTested: "Servings Quantity Stepper Plus (+)",
    steps: "Click Quantity Stepper Plus (+) button 5 times",
    expectedResult: "Increments total available servings from 1 to 6.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC236",
    category: "Post Food",
    feature: "Quantity Stepper",
    elementTested: "Servings Quantity Stepper Minus (-)",
    steps: "Click Quantity Stepper Minus (-) button 2 times",
    expectedResult: "Decrements total available servings from 6 to 4.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC237",
    category: "Post Food",
    feature: "Quantity Input",
    elementTested: "Direct Servings Input Field",
    steps: "Focus Servings Quantity field -> Type '15'",
    expectedResult: "Updates total servings directly to 15.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC238",
    category: "Post Food",
    feature: "Price Input",
    elementTested: "Discounted Price Field Input",
    steps: "Select Discounted mode -> Focus Price input -> Type '35'",
    expectedResult: "Price field accepts numeric value ₹35.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC239",
    category: "Post Food",
    feature: "Expiry Duration",
    elementTested: "Expiry Hours Slider Stepper - 2 Hours",
    steps: "Set Expiry Duration slider to 2 Hours",
    expectedResult: "Sets food listing expiry duration to 2 hours.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC240",
    category: "Post Food",
    feature: "Expiry Duration",
    elementTested: "Expiry Hours Slider Stepper - 4 Hours",
    steps: "Set Expiry Duration slider to 4 Hours",
    expectedResult: "Sets expiry duration to 4 hours.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC241",
    category: "Post Food",
    feature: "Expiry Duration",
    elementTested: "Expiry Hours Slider Stepper - 8 Hours",
    steps: "Set Expiry Duration slider to 8 Hours",
    expectedResult: "Sets expiry duration to 8 hours.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC242",
    category: "Post Food",
    feature: "Preparation Time",
    elementTested: "Cooked Time Picker Input",
    steps: "Click 'Preparation Time' picker -> Select 'Today, 1:30 PM'",
    expectedResult: "Stores preparation timestamp.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC243",
    category: "Post Food",
    feature: "Target Purpose",
    elementTested: "Purpose Radio - Humans",
    steps: "Click 'For Humans 👤' radio button",
    expectedResult: "Sets target purpose to Humans.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC244",
    category: "Post Food",
    feature: "Target Purpose",
    elementTested: "Purpose Radio - Animals",
    steps: "Click 'For Animals 🐾' radio button",
    expectedResult: "Sets target purpose to Animals.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC245",
    category: "Post Food",
    feature: "Target Purpose",
    elementTested: "Purpose Radio - Both",
    steps: "Click 'Both (Humans & Animals) 🔄' radio button",
    expectedResult: "Sets target purpose to Both.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC246",
    category: "Post Food",
    feature: "Animal Safety",
    elementTested: "Safe for Animals Checkbox Toggle",
    steps: "Click 'Safe for Animals (No spices/onion/garlic)' checkbox",
    expectedResult: "Toggles animal safety flag to true.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC247",
    category: "Post Food",
    feature: "Pickup Address",
    elementTested: "Pickup Address Text Field",
    steps: "Focus Pickup Address field -> Type 'Flat 402, Green Valley Apartments, Madhapur, Hyderabad'",
    expectedResult: "Address field accepts text.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC248",
    category: "Post Food",
    feature: "GPS Location",
    elementTested: "Use Current Location GPS Button",
    steps: "Click 'Use Current Location 📍' button on form",
    expectedResult: "Populates address field automatically from browser GPS coordinates.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC249",
    category: "Post Food",
    feature: "Image Upload",
    elementTested: "Food Photo File Input",
    steps: "Click 'Upload Food Image' dropzone -> Select 'biryani.jpg'",
    expectedResult: "Uploads image and renders thumbnail preview image card.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC250",
    category: "Post Food",
    feature: "Image Upload",
    elementTested: "Remove Uploaded Photo Button",
    steps: "Click Trash icon on uploaded image thumbnail",
    expectedResult: "Removes image thumbnail from form.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC251",
    category: "Post Food",
    feature: "Special Instructions",
    elementTested: "Notes / Special Instructions Textarea",
    steps: "Focus Special Instructions field -> Type 'Please bring vessel or bag for carrying container.'",
    expectedResult: "Textarea accepts notes string.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC252",
    category: "Post Food",
    feature: "Portion Splitting",
    elementTested: "Allow Portion Splitting Checkbox",
    steps: "Click 'Allow Partial Portion Claims' checkbox",
    expectedResult: "Enables portion splitting so multiple users can claim partial quantities.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC253",
    category: "Post Food",
    feature: "Preview Modal",
    elementTested: "Preview Listing CTA Button",
    steps: "Click 'Preview Listing 👁️' button on form",
    expectedResult: "Opens Listing Preview Modal showing how card will appear to receivers.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC254",
    category: "Post Food",
    feature: "Preview Modal",
    elementTested: "Close Preview Modal Button",
    steps: "Click 'Close Preview' button in modal",
    expectedResult: "Closes preview modal and returns to edit form.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC255",
    category: "Post Food",
    feature: "Publish Form",
    elementTested: "Publish Food Listing Submit Button",
    steps: "Fill mandatory fields -> Click 'Publish Food Listing 🚀' button",
    expectedResult: "Saves new listing to database, displays success alert, and redirects to /activity.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC256",
    category: "Post Food",
    feature: "Form Validation",
    elementTested: "Empty Title Validation Error",
    steps: "Leave Title field empty -> Click 'Publish Food Listing'",
    expectedResult: "Displays inline error: 'Food title is required'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC257",
    category: "Post Food",
    feature: "Form Validation",
    elementTested: "Zero Quantity Validation Error",
    steps: "Set quantity to 0 -> Click 'Publish Food Listing'",
    expectedResult: "Displays error: 'Quantity must be at least 1 portion'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC258",
    category: "Post Food",
    feature: "Form Validation",
    elementTested: "Empty Address Validation Error",
    steps: "Leave address blank -> Click 'Publish Food Listing'",
    expectedResult: "Displays error: 'Pickup address is required'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC259",
    category: "Post Food",
    feature: "Form Reset",
    elementTested: "Reset Form Button",
    steps: "Fill form fields -> Click 'Reset Form 🔄' button",
    expectedResult: "Clears all inputs and resets form back to default state.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC260",
    category: "Post Food",
    feature: "Dietary Checkbox",
    elementTested: "Contains Nuts Warning Checkbox",
    steps: "Check 'Contains Nuts / Allergens' checkbox",
    expectedResult: "Adds allergen warning tag to listing.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC261",
    category: "Post Food",
    feature: "Packaging Type",
    elementTested: "Containers Provided Radio - Yes",
    steps: "Select 'Containers Provided by Donor' radio",
    expectedResult: "Displays 'Containers Provided' note on listing.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC262",
    category: "Post Food",
    feature: "Packaging Type",
    elementTested: "Containers Provided Radio - Bring Own",
    steps: "Select 'Bring Own Containers' radio",
    expectedResult: "Displays 'Bring Own Containers' requirement on listing.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC263",
    category: "Post Food",
    feature: "Pickup Time Slots",
    elementTested: "Available Pickup Hours Start Selector",
    steps: "Select '5:00 PM' in Pickup Window Start dropdown",
    expectedResult: "Sets pickup window start time.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC264",
    category: "Post Food",
    feature: "Pickup Time Slots",
    elementTested: "Available Pickup Hours End Selector",
    steps: "Select '7:30 PM' in Pickup Window End dropdown",
    expectedResult: "Sets pickup window end time.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC265",
    category: "Post Food",
    feature: "Draft Autosave",
    elementTested: "Auto-Save Form Draft to Storage",
    steps: "Fill half the form -> Refresh browser tab",
    expectedResult: "Restores filled form draft inputs from local storage.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 8: ACTIVITY & CLAIMS MANAGEMENT (TC266 - TC290)
  // =========================================================================
  {
    id: "TC266",
    category: "Activity",
    feature: "Activity Page Navigation",
    elementTested: "Activity Nav Link Click",
    steps: "Click 'Activity' in main header navigation",
    expectedResult: "Navigates to /activity dashboard route.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC267",
    category: "Activity",
    feature: "Tab Switching",
    elementTested: "Active Claims Tab Button",
    steps: "Click 'Active Claims' tab header",
    expectedResult: "Displays list of ongoing claimed food reservations.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC268",
    category: "Activity",
    feature: "Tab Switching",
    elementTested: "Completed Claims Tab Button",
    steps: "Click 'Completed Claims' tab header",
    expectedResult: "Displays history of collected food claims.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC269",
    category: "Activity",
    feature: "Tab Switching",
    elementTested: "My Posted Donations Tab Button",
    steps: "Click 'My Posted Donations' tab header",
    expectedResult: "Displays food donations posted by logged in user.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC270",
    category: "Activity",
    feature: "Tab Switching",
    elementTested: "Cancelled Claims Tab Button",
    steps: "Click 'Cancelled Claims' tab header",
    expectedResult: "Displays list of cancelled reservations.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC271",
    category: "Activity",
    feature: "Claim Card Action",
    elementTested: "View Claim QR Code / PIN Button",
    steps: "Click 'View QR Pass 📲' button on active claim card",
    expectedResult: "Opens Claim Verification Pass modal displaying 6-digit PIN and QR code.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC272",
    category: "Activity",
    feature: "Claim Pass Modal",
    elementTested: "Close Claim Pass Modal Button",
    steps: "Click 'Close Pass' button in modal",
    expectedResult: "Closes Claim Pass modal.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC273",
    category: "Activity",
    feature: "Claim Card Action",
    elementTested: "Get Pickup Directions Button",
    steps: "Click 'Get Directions 🗺️' button on claim card",
    expectedResult: "Opens Google Maps navigation route in new browser tab.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC274",
    category: "Activity",
    feature: "Claim Card Action",
    elementTested: "Contact Donor Phone Button",
    steps: "Click 'Contact Donor 📞' button on claim card",
    expectedResult: "Launches phone dialer with donor's contact number.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC275",
    category: "Activity",
    feature: "Claim Card Action",
    elementTested: "Mark as Collected Button",
    steps: "Click 'Mark as Collected ✅' button on active claim card",
    expectedResult: "Prompts confirmation, marks claim status as Completed, and updates donor stats.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC276",
    category: "Activity",
    feature: "Claim Card Action",
    elementTested: "Cancel Reservation Button",
    steps: "Click 'Cancel Claim ❌' button on active claim card",
    expectedResult: "Opens Cancellation Confirmation Alert dialog.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC277",
    category: "Activity",
    feature: "Cancel Alert Dialog",
    elementTested: "Confirm Cancellation Button",
    steps: "Click 'Yes, Cancel Reservation' in confirmation alert",
    expectedResult: "Cancels claim, restores portion quantity back to listing, and moves claim to Cancelled tab.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC278",
    category: "Activity",
    feature: "Cancel Alert Dialog",
    elementTested: "Keep Reservation Cancel Button",
    steps: "Click 'No, Keep Reservation' in confirmation alert",
    expectedResult: "Closes alert dialog without cancelling claim.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC279",
    category: "Activity",
    feature: "Donation Action",
    elementTested: "Edit Posted Listing Button",
    steps: "Click 'Edit Listing ✏️' button on My Donations card",
    expectedResult: "Navigates to /post-food with listing fields pre-filled for editing.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC280",
    category: "Activity",
    feature: "Donation Action",
    elementTested: "Mark Out of Stock / Collected Button",
    steps: "Click 'Mark Collected / Completed' button on My Donations card",
    expectedResult: "Updates donation listing status to 'Completed'.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC281",
    category: "Activity",
    feature: "Donation Action",
    elementTested: "Extend Expiry Duration Button",
    steps: "Click 'Extend Expiry +2h' button on My Donations card",
    expectedResult: "Extends listing expiry countdown by 2 additional hours.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC282",
    category: "Activity",
    feature: "Donation Action",
    elementTested: "Delete Donation Listing Button",
    steps: "Click 'Delete Listing 🗑️' button -> Confirm deletion prompt",
    expectedResult: "Removes donation listing from database and refreshes list.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC283",
    category: "Activity",
    feature: "Donation Action",
    elementTested: "View Claimants List Button",
    steps: "Click 'View Claimants (3) 👥' button on My Donations card",
    expectedResult: "Opens modal displaying list of users who claimed portions of this donation.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC284",
    category: "Activity",
    feature: "Claimants Modal",
    elementTested: "Verify Claimant PIN Code Input",
    steps: "Enter '8492' into Claimant PIN Verification box -> Click 'Verify PIN'",
    expectedResult: "Matches claim PIN, marks recipient pickup verified.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC285",
    category: "Activity",
    feature: "Claimants Modal",
    elementTested: "Close Claimants Modal Button",
    steps: "Click 'Close' button in Claimants modal",
    expectedResult: "Closes modal.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC286",
    category: "Activity",
    feature: "Review Action",
    elementTested: "Rate & Review Donor Button",
    steps: "Click 'Rate & Review Donor ⭐️' button on completed claim card",
    expectedResult: "Opens Review Submission modal for donor.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC287",
    category: "Activity",
    feature: "Activity Filter",
    elementTested: "Search Claims Input Field",
    steps: "Focus Search Claims input -> Type 'Biryani'",
    expectedResult: "Filters active/completed claims matching 'Biryani'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC288",
    category: "Activity",
    feature: "Empty Activity State",
    elementTested: "No Claims Found Card",
    steps: "View Active Claims tab when user has 0 active claims",
    expectedResult: "Displays empty state card: 'You have no active claims. Browse food to reserve meals!'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC289",
    category: "Activity",
    feature: "Empty Activity State",
    elementTested: "Browse Food CTA Button",
    steps: "Click 'Browse Food Now' button on Empty Claims card",
    expectedResult: "Navigates to Home marketplace page.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC290",
    category: "Activity",
    feature: "Download Receipt",
    elementTested: "Download Claim Receipt PDF Button",
    steps: "Click 'Download Pass PDF 📄' button on active claim",
    expectedResult: "Triggers download of claim pass summary PDF.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 9: NGOS DIRECTORY & EXPIRED FEED (TC291 - TC310)
  // =========================================================================
  {
    id: "TC291",
    category: "NGO Directory",
    feature: "NGO Navigation",
    elementTested: "NGOs Nav Link Click",
    steps: "Click 'NGOs & Partners' in header navigation bar",
    expectedResult: "Directs browser URL to the /ngos verified partners directory.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC292",
    category: "NGO Directory",
    feature: "NGO Search",
    elementTested: "Search NGO Input Field",
    steps: "Focus Search NGO input -> Type 'Food Bank'",
    expectedResult: "Filters list of verified NGOs matching 'Food Bank'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC293",
    category: "NGO Directory",
    feature: "Category Filter",
    elementTested: "NGO Category Chip - All",
    steps: "Click 'All Partners' category chip",
    expectedResult: "Displays all registered NGO partners.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC294",
    category: "NGO Directory",
    feature: "Category Filter",
    elementTested: "NGO Category Chip - Animal Shelters",
    steps: "Click 'Animal Rescue & Shelters 🐾' category chip",
    expectedResult: "Filters list to animal welfare NGOs.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC295",
    category: "NGO Directory",
    feature: "Category Filter",
    elementTested: "NGO Category Chip - Food Banks",
    steps: "Click 'Food Banks 🥫' category chip",
    expectedResult: "Filters list to food bank organizations.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC296",
    category: "NGO Directory",
    feature: "Category Filter",
    elementTested: "NGO Category Chip - Orphanages",
    steps: "Click 'Orphanages & Child Care 👶' category chip",
    expectedResult: "Filters list to child care centers.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC297",
    category: "NGO Directory",
    feature: "NGO Action",
    elementTested: "Donate Food Direct Button",
    steps: "Click 'Donate Bulk Food Direct 🍲' button on NGO card",
    expectedResult: "Opens Direct Bulk Donation modal for selected NGO.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC298",
    category: "NGO Directory",
    feature: "NGO Action",
    elementTested: "Call NGO Phone Button",
    steps: "Click 'Call NGO 📞' button on NGO card",
    expectedResult: "Launches phone dialer with NGO contact number.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC299",
    category: "NGO Directory",
    feature: "NGO Action",
    elementTested: "Visit NGO Website Button",
    steps: "Click 'Visit Website 🌐' button on NGO card",
    expectedResult: "Opens NGO external official website in new tab.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC300",
    category: "NGO Directory",
    feature: "NGO Action",
    elementTested: "Volunteer Application Button",
    steps: "Click 'Join as Volunteer 🤝' button on NGO card",
    expectedResult: "Opens Volunteer Signup Application modal.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC301",
    category: "Expired Feed",
    feature: "Expired Navigation",
    elementTested: "Expired Feed Nav Link Click",
    steps: "Click 'Expired Listings' in header navigation bar",
    expectedResult: "Directs browser URL to the /expired historical listings feed.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC302",
    category: "Expired Feed",
    feature: "Filter Tab",
    elementTested: "Animal Feed Eligible Tab",
    steps: "Click 'Animal Feed Eligible 🐕' tab on Expired feed",
    expectedResult: "Displays expired food items suitable for animal feed.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC303",
    category: "Expired Feed",
    feature: "Filter Tab",
    elementTested: "Composting Only Tab",
    steps: "Click 'Composting Only 🌱' tab on Expired feed",
    expectedResult: "Displays expired food items suitable for bio-composting.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC304",
    category: "Expired Feed",
    feature: "Expired Action",
    elementTested: "Request for Animal Shelter Button",
    steps: "Click 'Request for Animal Shelter 🐾' button on expired card",
    expectedResult: "Opens animal feed claim request modal.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC305",
    category: "Expired Feed",
    feature: "Expired Action",
    elementTested: "Request for Composting Pickup Button",
    steps: "Click 'Request for Bio-Composting 🌱' button on expired card",
    expectedResult: "Opens compost pickup request modal.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC306",
    category: "Expired Feed",
    feature: "Safety Warning",
    elementTested: "Not for Human Consumption Warning Banner",
    steps: "Inspect top banner on Expired feed",
    expectedResult: "Displays prominent red safety warning banner: 'Items here are expired. Strictly NOT for human consumption'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC307",
    category: "Expired Feed",
    feature: "Expired Search",
    elementTested: "Search Expired Items Input",
    steps: "Focus Search Expired input -> Type 'Bread'",
    expectedResult: "Filters expired items list matching 'Bread'.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC308",
    category: "NGO Directory",
    feature: "NGO Operational Hours",
    elementTested: "Operating Hours Tag",
    steps: "Inspect 'Open: 9 AM - 7 PM' tag on NGO card",
    expectedResult: "Displays NGO daily working hours.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC309",
    category: "NGO Directory",
    feature: "NGO Location",
    elementTested: "NGO Address & Distance Tag",
    steps: "Inspect location tag on NGO card",
    expectedResult: "Displays NGO address and distance from user location.",
    mobileOSVerified: false,
    status: "PASS"
  },
  {
    id: "TC310",
    category: "Expired Feed",
    feature: "Compost Impact",
    elementTested: "Total Compost Generated Metric",
    steps: "Inspect 'Total Bio-Compost Generated' widget",
    expectedResult: "Displays metric count of organic waste converted to compost.",
    mobileOSVerified: false,
    status: "PASS"
  },

  // =========================================================================
  // CATEGORY 10: MULTI-TAB CROSS-VERIFICATION WORKFLOWS (TC311 - TC325)
  // =========================================================================
  {
    id: "TC311",
    category: "Multi-Tab Sync",
    feature: "Multi-Tab Browser Session",
    elementTested: "Tab 1 Session Login Setup",
    steps: "Open Tab 1 -> Navigate to https://pdd-food-new.vercel.app/auth -> Login with 'bunny.akki21@gmail.com' and 'Bunny123'",
    expectedResult: "Tab 1 logs in successfully and stores auth session token.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC312",
    category: "Multi-Tab Sync",
    feature: "Multi-Tab Browser Session",
    elementTested: "Tab 2 Automatic Session Inheritance",
    steps: "Open Tab 2 -> Navigate to https://pdd-food-new.vercel.app",
    expectedResult: "Tab 2 automatically inherits authenticated session state from local storage without requiring re-login.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC313",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Listing Creation",
    elementTested: "Tab 1 Donor Listing Creation",
    steps: "On Tab 1 -> Navigate to /post-food -> Publish new donation listing 'MultiTab Fresh Paneer Butter Masala (10 Servings)'",
    expectedResult: "Tab 1 publishes listing successfully and displays success alert.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC314",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Listing Creation",
    elementTested: "Tab 2 Instant Feed Reflection",
    steps: "Switch browser context to Tab 2 -> View Home feed (/) -> Refresh feed",
    expectedResult: "Tab 2 displays newly created 'MultiTab Fresh Paneer Butter Masala' listing at top of feed.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC315",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Reservation",
    elementTested: "Tab 2 Receiver Portion Claim",
    steps: "On Tab 2 -> Open 'MultiTab Fresh Paneer Butter Masala' detail -> Reserve 3 Portions",
    expectedResult: "Tab 2 completes reservation for 3 portions and generates Claim Code #CLM-9921.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC316",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Inventory Sync",
    elementTested: "Tab 1 Donor Inventory Deduction Verification",
    steps: "Switch browser context back to Tab 1 -> Navigate to /activity (My Posted Donations)",
    expectedResult: "Tab 1 reflects 3 claimed portions and updates remaining servings count from 10 to 7.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC317",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Status Update",
    elementTested: "Tab 2 Mark Claim as Collected",
    steps: "Switch context to Tab 2 -> Open Active Claims -> Click 'Mark as Collected'",
    expectedResult: "Tab 2 marks claim status as Completed.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC318",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Status Update",
    elementTested: "Tab 1 Donor Completion Verification",
    steps: "Switch context to Tab 1 -> Refresh My Donations view",
    expectedResult: "Tab 1 displays updated status 'Claim Collected & Completed'.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC319",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Cancellation Sync",
    elementTested: "Tab 2 Reserve & Cancel Claim",
    steps: "Tab 2 reserves 2 portions of another item -> Immediately clicks 'Cancel Reservation'",
    expectedResult: "Tab 2 cancels claim successfully.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC320",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Cancellation Sync",
    elementTested: "Tab 1 Portion Inventory Restoration",
    steps: "Switch context to Tab 1 -> Check listing portion inventory",
    expectedResult: "Tab 1 verifies that cancelled 2 portions are restored back to total available inventory.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC321",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Notification Sync",
    elementTested: "Tab 1 Notification Badge Trigger",
    steps: "Tab 2 claims a portion -> Inspect Tab 1 header Bell icon",
    expectedResult: "Tab 1 updates red notification badge counter (+1) in real time.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC322",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Review Submission",
    elementTested: "Tab 2 Submit Review for Donor",
    steps: "On Tab 2 -> Submit 5-star review for Tab 1 Donor",
    expectedResult: "Tab 2 submits review successfully.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC323",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Review Submission",
    elementTested: "Tab 1 Donor Rating Update",
    steps: "Switch context to Tab 1 -> Inspect User Profile dropdown trust score",
    expectedResult: "Tab 1 updates donor average trust score and review count instantly.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC324",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Logout",
    elementTested: "Tab 1 Logout Trigger",
    steps: "On Tab 1 -> Click User Avatar -> Click 'Logout'",
    expectedResult: "Tab 1 logs out, clears local storage auth tokens.",
    mobileOSVerified: true,
    status: "PASS"
  },
  {
    id: "TC325",
    category: "Multi-Tab Sync",
    feature: "Cross-Tab Logout",
    elementTested: "Tab 2 Session Invalidation Handshake",
    steps: "Switch context to Tab 2 -> Click any protected route link",
    expectedResult: "Tab 2 detects logged-out storage state and redirects gracefully to /auth.",
    mobileOSVerified: true,
    status: "PASS"
  }
];
