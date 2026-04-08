export const enTranslations = {
  nav: {
    admin: "Administration",
    gallery: "Gallery",
    menu: "Menu",
    myOrders: "My Orders",
    review: "Review",
    virtualTour: "Virtual Tour",
    hi: "Hi, {{name}}",
    signOut: "Sign Out",
    signIn: "Sign In",
    accountSettings: "Account Settings",
    language: "Language"
  },
  titles: {
    menu: "Gourmet2Go Menu",
    gallery: "Gallery",
    gallerySubtitle: "View our latest culinary creations and campus highlights.",
    review: "Submit a Review",
    reviewSubtitle: "Your feedback helps our culinary students grow and improve their craft.",
    contact: "Contact Us",
    contactSubtitle: "Have questions about Gourmet2Go or need help with your order? Send us a message and we'll get back to you shortly.",
    unauthorized: "Unauthorized Access",
    unauthorizedSubtitle: "You don't have to go home but you can't stay here (maybe check if you're logged in).",
    pageNotFound: "Page Not Found",
    pageNotFoundSubtitle: "Couldn't find the specified page. Which dev should pay for this?",
    successfulOrder: "Order Placed",
    successfulOrderSubtitle: "Thank you — your order has been accepted!",
    successfulOrderSubtitle2: "Come to L1170 on your selected menu day during our pickup hours to grab your meal."
  },
  helperWords: {
    outOf: "out of",
    of: "of",
    light: "Light",
    dark: "Dark",
    goBack: "Go Back",
    backToHome: "Back to Home",
    viewMyOrders: "View My Orders"
  },
  greeter: {
    greetings: {
      morning: "Good morning{{name}}",
      afternoon: "Good afternoon{{name}}",
      evening: "Good evening{{name}}",
      late: "It's late{{name}}"
    },
    weather: {
      default: "We hope you're having a great day!",
      freezing: "It's freezing outside! Order a hot meal to warm up.",
      cold: "It's quite cold out. A warm meal would be perfect.",
      chilly: "It's chilly outside. A warm dish would hit the spot!",
      mild: "The weather is mild. Great time to try something new from the menu!",
      warm: "It's warm outside! Enjoy one of our refreshing dishes.",
      scorcher: "It's a scorcher! Stay hydrated and enjoy a refreshing meal.",
      checking: "Checking the weather outside..."
    },
    auth: {
      title: "You must sign in with a Sault College email to order",
      subtitle: "Please log in to add to your cart and place your order."
    }
  },
  menu: {
    error: "Something went wrong: {{message}}",
    noMenus: "No Menus Available",
    comeBack: "Come back another time",
    activeOrderAlert: {
      part1: "You have an active order for",
      part2: "You must clear your cart to order from this date."
    },
    clearCart: "Clear Cart",
    noDishes: "No dishes have been added to this menu yet.",
    buttons: {
      add: "Add to Cart",
      locked: "Locked",
      soldOut: "Sold Out",
      cartFull: "Cart Full"
    },
    stock: {
      soldOut: "Sold Out",
      remaining: "{{count}} remaining"
    },
    categories: {
      Other: "Other",
      Soups: "Soups",
      Salads: "Salads",
      Sandwiches: "Sandwiches",
      Entrees: "Entrees",
      Desserts: "Desserts",
      Bowls: "Bowls",
      Sides: "Sides",
      Appetizers: "Appetizers"
    },
    days: {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun"
    }
  },
  orders: {
    loading: "Loading orders...",
    error: "Error loading orders",
    empty: {
      title: "No Orders Yet",
      subtitle: "Looks like you haven't placed any orders.",
      description: "Browse our menu to find your next favorite meal and place your first order today!",
      goBack: "Go Back",
      browseMenu: "Browse Menu"
    },
    status: {
      PENDING: "PENDING",
      FULFILLED: "FULFILLED",
      INACTIVE: "INACTIVE"
    },
    card: {
      orderNumber: "Order #{{number}}",
      showQr: "Show QR",
      hideQr: "Hide QR",
      cancelling: "Cancelling...",
      cancelOrder: "Cancel Order",
      cutoffPassed: "Cutoff Passed",
      qrInstruction: "Show this to the staff at pickup",
      menuDay: "Menu Day:",
      notes: "Notes:",
      total: "Total"
    },
    title: "My Orders",
    pendingTitle: "Pending Orders",
    noPending: "You have no pending orders.",
    toggleHistory: {
      show: "Show Fulfilled & Inactive Orders ▼",
      hide: "Hide Fulfilled & Inactive Orders ▲"
    },
    alerts: {
      cutoffPassed: "Order cancellation cutoff has passed.",
      deleteFailed: "Failed to delete order. Please try again."
    }
  },
  review: {
    disclaimer: "Disclaimer: Only one review can be submitted per dish. All submissions are final.",
    selectDish: "Select Dish",
    chooseDish: "Choose a dish you've tried...",
    overallRating: "Overall Rating",
    rateStar: "Rate {{star}} star{{suffix}}",
    yourFeedback: "Your Feedback",
    placeholder: "Tell us what you liked (or what could be better)...",
    submittingBtn: "Submitting...",
    submitBtn: "Submit Review",
    unauthorized: "You must have an active student account and a fulfilled order to leave reviews.",
    toasts: {
      submitting: "Submitting your review...",
      success: "Review submitted successfully!",
      error: "Failed to submit review. Please try again."
    },
    validation: {
      minRating: "Rating must be at least 1",
      maxRating: "Rating cannot be more than 5",
      maxComment: "Comment cannot exceed 500 characters"
    }
  },
  cart: {
    header: {
      orderTitle: "{{name}}'s Order",
      items: "items",
      limitReached: "Limit Reached"
    },
    empty: {
      title: "Cart is Empty",
      subtitle: "If you're hungry, I suggest you browse our menu",
      browseBtn: "Browse Menu"
    },
    items: {
      maxLimitHover: "Maximum 5 per item",
      addHover: "Add one",
      removeHover: "Remove Item"
    },
    footer: {
      subtotal: "Subtotal",
      checkoutBtn: "Checkout"
    }
  },
  settings: {
    sidebar: {
      title: "User Settings",
      myAccount: "My Account",
      security: "Security"
    },
    account: {
      title: "My Account",
      adminRole: "Admin",
      profileInfo: "Profile Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      cannotChange: "(Cannot be changed)",
      unsavedChanges: "Careful — you have unsaved changes!",
      reset: "Reset",
      saveChanges: "Save Changes",
      validation: {
        firstNameRequired: "First name is required",
        lastNameRequired: "Last name is required"
      }
    },
    security: {
      title: "Security",
      changePassword: "Change Password",
      goToChange: "Go To Change Password",
      dangerZone: "Danger Zone",
      dangerWarning: "Once you delete your account, there is no going back. Please be certain.",
      deleteAccountBtn: "Delete Account",
      modal: {
        title: "Delete Account",
        cannotUndo: "This action cannot be undone.",
        description: "You are about to permanently delete your account, along with all of your associated data and past orders.",
        typePromptPart1: "Please type",
        typePromptPart2: "to confirm.",
        targetPhrase: "Delete my account",
        cancel: "Cancel",
        confirm: "Confirm Deletion"
      },
      toasts: {
        deleting: "Deleting your account...",
        success: "Your account has been deleted.",
        error: "Error deleting account. Please try again."
      }
    }
  },
  footer: {
    links: {
      about: "About",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact"
    },
    rights: "All Rights Reserved."
  },
  auth: {
    validation: {
      invalidEmail: "Invalid email address",
      saultEmail: "You must use your 8-digit Sault College email to sign in",
      saultEmailSignUp: "You must use your 8-digit Sault College email to sign up",
      passwordRequired: "Password is required",
      passwordMin: "Password must be at least 8 characters",
      passwordNumber: "Password must contain at least one number",
      passwordLowercase: "Password must contain at least one lowercase letter",
      passwordUppercase: "Password must contain at least one uppercase letter",
      passwordSpecial: "Password must contain at least one special character",
      firstNameRequired: "First name is required",
      lastNameRequired: "Last name is required",
      acceptTerms: "You must accept the Terms of Service and Privacy Policy",
      passwordsMatch: "Passwords do not match"
    },
    signIn: {
      title: "Welcome Back",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      signingInBtn: "Signing in...",
      signInBtn: "Sign In",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      signUpLink: "Sign Up",
      toasts: {
        enterEmailFirst: "Please enter your email address first.",
        sendingReset: "Sending reset email...",
        resetSent: "Password reset email sent! Check your inbox.",
        signingIn: "Signing in...",
        success: "Successfully signed in!",
        error: "Failed to sign in. Please check your credentials."
      }
    },
    signUp: {
      title: "Create Your Account",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      agree: "I agree to the",
      terms: "Terms of Service",
      and: " and ",
      privacy: "Privacy Policy",
      creatingBtn: "Creating Account...",
      signUpBtn: "Sign Up",
      hasAccount: "Already have an account?",
      signInLink: "Sign In",
      toasts: {
        creating: "Creating your account...",
        error: "Error signing up. Please try again.",
        success: "Sign-up successful! Check your email for the confirmation link."
      }
    }
  },
  about: {
    heroSubtitle: "Fresh meals prepared by Sault College culinary students",
    special: {
      title: "What Makes It Special",
      p1: "Gourmet2Go offers delicious, freshly prepared meals made by Sault College culinary students. It's your chance to enjoy high-quality, chef-style dishes right here on campus!",
      p2: "Every week, our culinary team creates exciting new menus featuring soups, entrées, and more. Limited quantities are prepared fresh each service day, so ordering early ensures you don't miss out.",
      p3: "Pre-ordering through our app is quick and convenient—browse the weekly menu, select your favorites, and pick them up during scheduled hours. No waiting in long lines!"
    },
    howItWorks: {
      title: "How It Works",
      step1: "Browse the weekly menu and select your meals",
      step2: "Place your order before the cutoff time",
      step3: "Receive email confirmation with pickup details",
      step4: "Pick up your meal and pay in person"
    },
    serviceHours: {
      title: "Service Hours",
      wednesday: "Wednesday",
      wednesdayTime: "12:15 - 12:45 PM",
      thursday: "Thursday",
      thursdayTime: "12:15 - 12:45 PM",
      note: "Service times may vary each semester. Check weekly announcements for updates."
    },
    rules: {
      title: "Important Rules",
      rule1: "One active order per person at a time",
      rule2: "Maximum 5 items total per order",
      rule3: "Orders must be placed by 12:00 PM (15 minutes before service)",
      rule4: "Payment by card only at pickup (no cash accepted)",
      rule5: "Items available on a first-come, first-served basis"
    },
    location: {
      title: "Pickup Location",
      room: "Room L1170 - Culinary Department",
      desc: "Located in the main building. You'll receive an email with your pickup time when your order is ready."
    }
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "Your privacy is important to us. Learn how we collect, use, and protect your information.",
    lastUpdated: "Last Updated: {{date}}",
    sections: {
      intro: {
        title: "1. Introduction",
        p1: "Welcome to Gourmet2Go. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our online food ordering platform.",
        p2: "By using our service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service."
      },
      collect: {
        title: "2. Information We Collect",
        personal: {
          title: "2.1 Personal Information",
          desc: "When you create an account or place an order, we may collect:",
          items: [
            "Full name (first and last name)",
            "Email address",
            "Student ID number"
          ]
        },
        order: {
          title: "2.2 Order Information",
          desc: "We collect details about your orders, including:",
          items: [
            "Items ordered and quantities",
            "Order date and time",
            "Pickup location and time",
            "Order status and history",
            "Special instructions or requests"
          ]
        },
        payment: {
          title: "2.3 Payment Information",
          desc: "Payment is required at pickup by card only (no cash accepted). We do not store your credit card information on our servers. Payment processing is handled securely through our payment provider in compliance with PCI DSS standards."
        },
        technical: {
          title: "2.4 Technical Information",
          desc: "We automatically collect certain technical information, including:",
          items: [
            "IP address and device information",
            "Browser type and version",
            "Operating system"
          ]
        }
      },
      use: {
        title: "3. How We Use Your Information",
        desc: "We use the information we collect for the following purposes:",
        items: [
          "To process and fulfill your food orders",
          "To communicate order confirmations, updates, and pickup notifications",
          "To manage your account and provide customer support",
          "To improve our menu offerings based on ordering patterns",
          "To accommodate dietary restrictions and food allergies",
          "To send important updates about service hours or menu changes",
          "To maintain records for operational and compliance purposes",
          "To analyze usage patterns and improve our platform",
          "To prevent fraud and ensure system security"
        ]
      },
      share: {
        title: "4. How We Share Your Information",
        desc: "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:",
        admin: {
          title: "College Administration",
          desc: "When required for institutional reporting or compliance purposes"
        },
        emergency: {
          title: "Emergency Situations",
          desc: "To protect health and safety in cases involving food allergies or medical emergencies"
        }
      },
      security: {
        title: "5. Data Security",
        desc: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:",
        items: [
          "Encryption of data in transit and at rest",
          "Regular security audits and monitoring",
          "Access controls and authentication requirements",
          "Secure backup and recovery procedures",
          "Employee training on data protection practices"
        ],
        warning: "However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security."
      },
      retention: {
        title: "6. Data Retention",
        desc: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:",
        items: [
          "Account information is retained while your account is active",
          "Order history is kept for 2 years for operational and reporting purposes",
          "Payment records are retained as required by financial regulations",
          "Analytics data may be retained in aggregated, anonymized form indefinitely"
        ]
      },
      rights: {
        title: "7. Your Privacy Rights",
        desc: "You have the following rights regarding your personal information:",
        items: {
          access: { title: "Access", desc: "Request a copy of the personal information we hold about you" },
          correction: { title: "Correction", desc: "Request correction of inaccurate or incomplete information" },
          deletion: { title: "Deletion", desc: "Request deletion of your personal information (subject to legal obligations)" },
          portability: { title: "Data Portability", desc: "Receive your data in a structured, machine-readable format" },
          optOut: { title: "Opt-out", desc: "Unsubscribe from marketing communications" },
          restriction: { title: "Restriction", desc: "Request restriction of processing in certain circumstances" }
        },
        contactBold: "To exercise any of these rights,",
        contactRest: "please visit the Culinary Department staff in Room L1170."
      },
      changes: {
        title: "8. Changes to This Privacy Policy",
        p1: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last Updated\" date at the top of this policy.",
        p2: "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
      }
    }
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Please read these terms carefully before using Gourmet2Go",
    lastUpdated: "Last Updated: {{date}}",
    sections: {
      agreement: {
        title: "1. Agreement to Terms",
        p1: "Welcome to Gourmet2Go. By accessing or using our online food ordering platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.",
        p2: "These Terms of Service apply to all users of the platform, including students, faculty, staff, and administrators of Sault College."
      },
      account: {
        title: "2. Account Registration and Eligibility",
        p1: "To use Gourmet2Go, you must:",
        items: [
          "Be a current Sault College student, faculty, or staff member",
          "Provide accurate, current, and complete information during registration",
          "Maintain the security of your account password",
          "Notify us immediately of any unauthorized use of your account",
          "Be responsible for all activities that occur under your account"
        ],
        p2: "We reserve the right to suspend or terminate accounts that violate these terms or are associated with fraudulent activity."
      },
      policies: {
        title: "3. Order Policies",
        limits: {
          title: "Order Limits",
          items: [
            "• One active order per person at a time",
            "• Maximum 5 items total per order",
            "• Orders subject to item availability"
          ]
        },
        deadlines: {
          title: "Order Deadlines",
          desc: "Orders must be placed by 12:00 PM (15 minutes before service begins). Late orders will not be accepted. This ensures our culinary team has adequate time to prepare your meal."
        },
        reservations: {
          title: "Reservations",
          desc: "Adding items to your cart does NOT reserve them. Items are only reserved after you complete checkout and receive order confirmation. Reserved items are released after closing if not picked up."
        }
      },
      payment: {
        title: "4. Payment Terms",
        items: [
          "Payment is required at pickup by card only (no cash accepted)",
          "Prices may change without notice",
          "All sales are final - no refunds except for quality issues",
          "Unclaimed orders will not be refunded"
        ]
      },
      pickup: {
        title: "5. Pickup Requirements",
        p1: "Orders must be picked up during designated service hours:",
        hoursTitle: "Service Hours",
        hours: "Wednesday & Thursday: 12:15 - 12:45 PM",
        locationTitle: "Location",
        location: "Room L1170 - Culinary Department",
        items: [
          "You must present your student/staff ID at pickup",
          "Orders not picked up during service hours will be released",
          "No refunds for unclaimed orders",
          "You will receive email notification when your order is ready"
        ]
      },
      cancellation: {
        title: "6. Cancellation and Modification",
        p1: "Orders can be modified or cancelled through your account dashboard before the daily cutoff time of 12:00 PM. After the cutoff, orders cannot be cancelled or modified as meal preparation has begun.",
        warning: "Late cancellations (after cutoff) or no-shows may result in temporary suspension of ordering privileges."
      },
      safety: {
        title: "7. Food Safety and Allergies",
        p1: "While we make every effort to accommodate dietary restrictions and allergies, our kitchen handles common allergens including dairy, eggs, wheat, soy, nuts, and shellfish. Cross-contamination may occur.",
        important: "Important:",
        warning: " If you have severe food allergies, please consult with our culinary staff before ordering. We cannot guarantee allergen-free meals.",
        items: [
          "Ingredient lists are provided for all menu items",
          "You are responsible for reviewing ingredients before ordering",
          "Special dietary requests must be submitted in advance",
          "We are not liable for allergic reactions resulting from undisclosed allergies"
        ]
      },
      prohibited: {
        title: "8. Prohibited Conduct",
        p1: "You agree NOT to:",
        items: [
          "Create multiple accounts to circumvent order limits",
          "Place fraudulent or abusive orders",
          "Share your account credentials with others",
          "Resell meals purchased through Gourmet2Go",
          "Attempt to manipulate prices or inventory",
          "Use automated systems to place orders (bots)",
          "Harass or abuse staff members",
          "Violate any applicable laws or regulations"
        ],
        p2: "Violation of these terms may result in immediate account termination and potential disciplinary action through Sault College."
      },
      liability: {
        title: "9. Limitation of Liability",
        p1: "Gourmet2Go and Sault College shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service, including but not limited to:",
        items: [
          "Errors or inaccuracies in menu descriptions",
          "Unavailability of menu items",
          "Service interruptions or technical issues",
          "Food quality concerns (subject to quality guarantee)",
          "Delays in order preparation or pickup"
        ]
      },
      availability: {
        title: "10. Service Availability",
        p1: "Gourmet2Go operates during the academic year and is subject to closure during:",
        items: [
          "College holidays and breaks",
          "Reading weeks and exam periods",
          "Summer semester (unless otherwise announced)",
          "Emergency situations or unforeseen circumstances"
        ],
        p2: "We reserve the right to modify service hours, suspend operations, or discontinue the service at any time without prior notice."
      },
      changes: {
        title: "11. Changes to Terms",
        p1: "We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes via email or prominent notice on the platform. Your continued use of Gourmet2Go after such modifications constitutes acceptance of the updated terms.",
        p2: "It is your responsibility to review these terms periodically. The \"Last Updated\" date at the top of this page indicates when the terms were last revised."
      }
    }
  },
  contact: {
    info: {
      pickupLocation: "Pickup Location",
      phone: "Phone",
      serviceHours: "Service Hours",
      addressLine1: "443 Northern Ave, Sault Ste. Marie, ON",
      addressLine2: "Room L1170",
      hoursDays: "Wednesdays & Thursdays",
      hoursTime: "12:15 PM – 12:45 PM"
    },
    form: {
      title: "Send us a message",
      name: "Name",
      email: "Email",
      message: "Message",
      placeholders: {
        name: "John Doe",
        email: "john@example.com",
        message: "How can we help you today?"
      },
      button: {
        sending: "Sending...",
        send: "Send Message"
      }
    },
    validation: {
      nameRequired: "Name is required",
      nameMax: "Name is too long (max 35 characters)",
      emailMax: "Email is too long",
      messageMin: "Message must be at least 10 characters",
      messageMax: "Your message can be a maximum of 500 characters"
    },
    feedback: {
      success: "Your message has been sent successfully!",
      error: "Failed to send message. Please try again later."
    }
  }
};