export const frTranslations = {
  nav: {
    admin: "Administration",
    gallery: "Galerie",
    menu: "Menu",
    myOrders: "Commandes",      
    review: "Avis",             
    virtualTour: "Tour virtuel",
    hi: "Salut, {{name}}",      
    signOut: "Quitter",         
    signIn: "Connexion",        
    accountSettings: "Mon profil", 
    language: "Langue"          
  },
  titles: {
    menu: "Menu de Gourmet2Go",
    gallery: "Galerie",
    gallerySubtitle: "Venez découvrir nos nouvelles créations culinaires et les faits saillants du campus.",
    review: "Soumettre un avis",
    reviewSubtitle: "Vos commentaires aident nos étudiants en cuisine à progresser et à perfectionner leur savoir-faire.",
    contact: "Contactez-nous",
    contactSubtitle: "Vous avez des questions sur Gourmet2Go ou besoin d’aide avec votre commande? Envoyez-nous un message et on vous répondra sous peu.",
    unauthorized: "Accès non autorisé",
    unauthorizedSubtitle: "T’es pas obligé de rentrer chez toi, mais tu peux pas rester ici (vérifie peut-être que t’es connecté).",
    pageNotFound: "Page non trouvée",
    pageNotFoundSubtitle: "On a pas trouvé la page demandée… c’est quel dev qui paie pour ça?",
    successfulOrder: "Commande passée",
    successfulOrderSubtitle: "Merci — ta commande est acceptée!",
    successfulOrderSubtitle2: "Passez au local L1170 le jour choisi de votre menu pendant nos heures de pickup pour venir chercher votre repas."
  },
  helperWords: {
    outOf: "sur",
    of: "de",
    light: "Clair",
    dark: "Sombre",
    goBack: "Retour",
    backToHome: "Retour à l'accueil",
    viewMyOrders: "Voir mes commandes"
  },
  greeter: {
    greetings: {
      morning: "Bon matin{{name}}",
      afternoon: "Bon après-midi{{name}}",
      evening: "Bonsoir{{name}}",
      late: "Il se fait tard{{name}}"
    },
    weather: {
      default: "On espère que vous passez une belle journée!",
      freezing: "Il fait vraiment froid dehors! Commandez un repas chaud pour vous réchauffer.",
      cold: "Il fait plutôt froid. Un repas chaud serait parfait.",
      chilly: "C'est un peu frais dehors. Un plat chaud ferait du bien!",
      mild: "La température est douce. C'est le moment idéal pour essayer une nouveauté au menu!",
      warm: "Il fait chaud dehors! Profitez d'un de nos plats rafraîchissants.",
      scorcher: "C'est la canicule! Restez bien hydraté et savourez un repas rafraîchissant.",
      checking: "Vérification de la météo..."
    },
    auth: {
      title: "Vous devez vous connecter avec un courriel de Sault College pour commander",
      subtitle: "Veuillez vous connecter pour ajouter des articles à votre panier et passer votre commande."
    }
  },
  menu: {
    error: "Quelque chose s'est mal passé : {{message}}",
    noMenus: "Aucun menu disponible",
    comeBack: "Revenez plus tard",
    activeOrderAlert: {
      part1: "Vous avez une commande active pour le",
      part2: "Vous devez vider votre panier pour commander à cette date."
    },
    clearCart: "Vider le panier",
    noDishes: "Aucun plat n'a encore été ajouté à ce menu.",
    buttons: {
      add: "Ajouter au panier",
      locked: "Verrouillé",
      soldOut: "Épuisé",
      cartFull: "Panier plein"
    },
    stock: {
      soldOut: "Épuisé",
      remaining: "{{count}} restants"
    },
    categories: {
      Other: "Autre",
      Soups: "Soupes",
      Salads: "Salades",
      Sandwiches: "Sandwichs",
      Entrees: "Plats principaux",
      Desserts: "Desserts",
      Bowls: "Bols",
      Sides: "Accompagnements",
      Appetizers: "Entrées"
    },
    days: {
      Monday: "Lun",
      Tuesday: "Mar",
      Wednesday: "Mer",
      Thursday: "Jeu",
      Friday: "Ven",
      Saturday: "Sam",
      Sunday: "Dim"
    }
  },
  orders: {
    loading: "Chargement des commandes...",
    error: "Erreur lors du chargement des commandes",
    empty: {
      title: "Aucune commande pour le moment",
      subtitle: "Il semble que vous n'ayez passé aucune commande.",
      description: "Parcourez notre menu pour trouver votre prochain repas préféré et passez votre première commande dès aujourd'hui!",
      goBack: "Retour",
      browseMenu: "Parcourir le menu"
    },
    status: {
      PENDING: "EN ATTENTE",
      FULFILLED: "COMPLÉTÉE",
      INACTIVE: "INACTIVE"
    },
    card: {
      orderNumber: "Commande #{{number}}",
      showQr: "Afficher QR",
      hideQr: "Masquer QR",
      cancelling: "Annulation...",
      cancelOrder: "Annuler la commande",
      cutoffPassed: "Délai dépassé",
      qrInstruction: "Montrez ceci au personnel lors de la cueillette",
      menuDay: "Jour du menu :",
      notes: "Notes :",
      total: "Total"
    },
    title: "Mes commandes",
    pendingTitle: "Commandes en attente",
    noPending: "Vous n'avez aucune commande en attente.",
    toggleHistory: {
      show: "Afficher les commandes complétées et inactives ▼",
      hide: "Masquer les commandes complétées et inactives ▲"
    },
    alerts: {
      cutoffPassed: "Le délai d'annulation de la commande est dépassé.",
      deleteFailed: "Échec de l'annulation de la commande. Veuillez réessayer."
    }
  },
  review: {
    disclaimer: "Avertissement : Une seule évaluation peut être soumise par plat. Toutes les soumissions sont définitives.",
    selectDish: "Sélectionner un plat",
    chooseDish: "Choisissez un plat que vous avez essayé...",
    overallRating: "Note globale",
    rateStar: "Évaluer à {{star}} étoile{{suffix}}",
    yourFeedback: "Vos commentaires",
    placeholder: "Dites-nous ce que vous avez aimé (ou ce qui pourrait être amélioré)...",
    submittingBtn: "Envoi en cours...",
    submitBtn: "Soumettre l'évaluation",
    unauthorized: "Vous devez avoir un compte étudiant actif et une commande complétée pour laisser une évaluation.",
    toasts: {
      submitting: "Envoi de votre évaluation...",
      success: "Évaluation soumise avec succès!",
      error: "Échec de l'envoi de l'évaluation. Veuillez réessayer."
    },
    validation: {
      minRating: "La note doit être d'au moins 1",
      maxRating: "La note ne peut pas dépasser 5",
      maxComment: "Le commentaire ne peut pas dépasser 500 caractères"
    }
  },
  cart: {
    header: {
      orderTitle: "Commande de {{name}}",
      items: "articles",
      limitReached: "Limite atteinte"
    },
    empty: {
      title: "Le panier est vide",
      subtitle: "Si vous avez faim, on vous suggère de parcourir notre menu",
      browseBtn: "Parcourir le menu"
    },
    items: {
      maxLimitHover: "Maximum 5 par article",
      addHover: "Ajouter un",
      removeHover: "Retirer l'article"
    },
    footer: {
      subtotal: "Sous-total",
      checkoutBtn: "Passer à la caisse"
    }
  },
  settings: {
    sidebar: {
      title: "Paramètres utilisateur",
      myAccount: "Mon compte",
      security: "Sécurité"
    },
    account: {
      title: "Mon compte",
      adminRole: "Admin",
      profileInfo: "Informations du profil",
      firstName: "Prénom",
      lastName: "Nom de famille",
      email: "Courriel",
      cannotChange: "(Ne peut pas être modifié)",
      unsavedChanges: "Attention — vous avez des modifications non enregistrées!",
      reset: "Réinitialiser",
      saveChanges: "Enregistrer les modifications",
      validation: {
        firstNameRequired: "Le prénom est requis",
        lastNameRequired: "Le nom de famille est requis"
      }
    },
    security: {
      title: "Sécurité",
      changePassword: "Changer le mot de passe",
      goToChange: "Aller à la modification du mot de passe",
      dangerZone: "Zone de danger",
      dangerWarning: "Une fois votre compte supprimé, il n'y a pas de retour en arrière. Soyez-en certain.",
      deleteAccountBtn: "Supprimer le compte",
      modal: {
        title: "Supprimer le compte",
        cannotUndo: "Cette action est irréversible.",
        description: "Vous êtes sur le point de supprimer définitivement votre compte, ainsi que toutes vos données associées et vos commandes passées.",
        typePromptPart1: "Veuillez taper",
        typePromptPart2: "pour confirmer.",
        targetPhrase: "Supprimer mon compte",
        cancel: "Annuler",
        confirm: "Confirmer la suppression"
      },
      toasts: {
        deleting: "Suppression de votre compte en cours...",
        success: "Votre compte a été supprimé.",
        error: "Erreur lors de la suppression du compte. Veuillez réessayer."
      }
    }
  },
  footer: {
    links: {
      about: "À propos",
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      contact: "Nous joindre"
    },
    rights: "Tous droits réservés."
  },
  auth: {
    validation: {
      invalidEmail: "Adresse courriel invalide",
      saultEmail: "Vous devez utiliser votre courriel de Sault College à 8 chiffres pour vous connecter",
      saultEmailSignUp: "Vous devez utiliser votre courriel de Sault College à 8 chiffres pour vous inscrire",
      passwordRequired: "Le mot de passe est requis",
      passwordMin: "Le mot de passe doit contenir au moins 8 caractères",
      passwordNumber: "Le mot de passe doit contenir au moins un chiffre",
      passwordLowercase: "Le mot de passe doit contenir au moins une lettre minuscule",
      passwordUppercase: "Le mot de passe doit contenir au moins une lettre majuscule",
      passwordSpecial: "Le mot de passe doit contenir au moins un caractère spécial",
      firstNameRequired: "Le prénom est requis",
      lastNameRequired: "Le nom de famille est requis",
      acceptTerms: "Vous devez accepter les conditions d'utilisation et la politique de confidentialité",
      passwordsMatch: "Les mots de passe ne correspondent pas"
    },
    signIn: {
      title: "Bon retour",
      emailLabel: "Adresse courriel",
      passwordLabel: "Mot de passe",
      signingInBtn: "Connexion en cours...",
      signInBtn: "Se connecter",
      forgotPassword: "Mot de passe oublié?",
      noAccount: "Vous n'avez pas de compte?",
      signUpLink: "S'inscrire",
      toasts: {
        enterEmailFirst: "Veuillez d'abord entrer votre adresse courriel.",
        sendingReset: "Envoi du courriel de réinitialisation...",
        resetSent: "Courriel de réinitialisation envoyé! Vérifiez votre boîte de réception.",
        signingIn: "Connexion en cours...",
        success: "Connexion réussie!",
        error: "Échec de la connexion. Veuillez vérifier vos identifiants."
      }
    },
    signUp: {
      title: "Créer votre compte",
      firstNameLabel: "Prénom",
      lastNameLabel: "Nom de famille",
      emailLabel: "Adresse courriel",
      passwordLabel: "Mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      agree: "J'accepte les ",
      terms: "conditions d'utilisation",
      and: " et la ",
      privacy: "politique de confidentialité",
      creatingBtn: "Création du compte...",
      signUpBtn: "S'inscrire",
      hasAccount: "Vous avez déjà un compte?",
      signInLink: "Se connecter",
      toasts: {
        creating: "Création de votre compte en cours...",
        error: "Erreur lors de l'inscription. Veuillez réessayer.",
        success: "Inscription réussie! Vérifiez votre courriel pour le lien de confirmation."
      }
    }
  },
  about: {
    heroSubtitle: "Des repas frais préparés par les étudiants en cuisine du Sault College",
    special: {
      title: "Ce qui nous rend uniques",
      p1: "Gourmet2Go propose de délicieux repas fraîchement préparés par les étudiants en cuisine du Sault College. C'est votre chance de savourer des plats de qualité digne d'un chef, directement sur le campus!",
      p2: "Chaque semaine, notre brigade culinaire élabore de nouveaux menus appétissants comprenant des soupes, des plats principaux et plus encore. Les quantités sont limitées et préparées fraîches chaque jour de service; commandez tôt pour ne rien manquer.",
      p3: "Précommander via notre application est rapide et pratique — parcourez le menu de la semaine, choisissez vos favoris et passez les récupérer pendant les heures prévues. Fini les longues files d'attente!"
    },
    howItWorks: {
      title: "Comment ça fonctionne",
      step1: "Parcourez le menu de la semaine et choisissez vos plats",
      step2: "Passez votre commande avant l'heure limite",
      step3: "Recevez une confirmation par courriel avec les détails de ramassage",
      step4: "Récupérez votre repas et payez sur place"
    },
    serviceHours: {
      title: "Heures de service",
      wednesday: "Mercredi",
      wednesdayTime: "12 h 15 - 12 h 45",
      thursday: "Jeudi",
      thursdayTime: "12 h 15 - 12 h 45",
      note: "Les heures de service peuvent varier chaque session. Consultez les annonces hebdomadaires pour les mises à jour."
    },
    rules: {
      title: "Règlements importants",
      rule1: "Une seule commande active par personne à la fois",
      rule2: "Maximum de 5 articles au total par commande",
      rule3: "Les commandes doivent être passées avant 12 h 00 (15 minutes avant le service)",
      rule4: "Paiement par carte seulement lors du ramassage (argent comptant refusé)",
      rule5: "Articles offerts selon le principe du premier arrivé, premier servi"
    },
    location: {
      title: "Lieu de ramassage",
      room: "Local L1170 - Département de cuisine",
      desc: "Situé dans le bâtiment principal. Vous recevrez un courriel avec votre heure de ramassage lorsque votre commande sera prête."
    }
  },
  privacy: {
    title: "Politique de confidentialité",
    subtitle: "Votre vie privée est importante pour nous. Découvrez comment nous recueillons, utilisons et protégeons vos renseignements.",
    lastUpdated: "Dernière mise à jour : {{date}}",
    sections: {
      intro: {
        title: "1. Introduction",
        p1: "Bienvenue sur Gourmet2Go. Nous nous engageons à protéger votre vie privée et à assurer la sécurité de vos renseignements personnels. Cette politique de confidentialité explique comment nous recueillons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme de commande de nourriture en ligne.",
        p2: "En utilisant notre service, vous acceptez la collecte et l'utilisation de vos renseignements conformément à cette politique. Si vous n'êtes pas d'accord avec nos politiques et pratiques, veuillez ne pas utiliser notre service."
      },
      collect: {
        title: "2. Renseignements recueillis",
        personal: {
          title: "2.1 Renseignements personnels",
          desc: "Lorsque vous créez un compte ou passez une commande, nous pourrions recueillir :",
          items: [
            "Nom complet (prénom et nom de famille)",
            "Adresse courriel",
            "Numéro d'étudiant"
          ]
        },
        order: {
          title: "2.2 Informations de commande",
          desc: "Nous recueillons des détails sur vos commandes, notamment :",
          items: [
            "Articles commandés et quantités",
            "Date et heure de la commande",
            "Lieu et heure de ramassage",
            "Statut et historique de la commande",
            "Instructions ou demandes spéciales"
          ]
        },
        payment: {
          title: "2.3 Informations de paiement",
          desc: "Le paiement est requis lors du ramassage, par carte seulement (argent comptant refusé). Nous ne conservons pas les informations de votre carte de crédit sur nos serveurs. Le traitement des paiements est géré de façon sécuritaire par notre fournisseur de paiements, en conformité avec les normes PCI DSS."
        },
        technical: {
          title: "2.4 Informations techniques",
          desc: "Nous recueillons automatiquement certaines informations techniques, y compris :",
          items: [
            "Adresse IP et informations sur l'appareil",
            "Type et version du navigateur",
            "Système d'exploitation"
          ]
        }
      },
      use: {
        title: "3. Comment nous utilisons vos renseignements",
        desc: "Nous utilisons les renseignements recueillis aux fins suivantes :",
        items: [
          "Pour traiter et préparer vos commandes de nourriture",
          "Pour communiquer les confirmations de commande, les mises à jour et les avis de ramassage",
          "Pour gérer votre compte et offrir un soutien à la clientèle",
          "Pour améliorer nos menus en fonction des habitudes de commande",
          "Pour accommoder les restrictions alimentaires et les allergies",
          "Pour envoyer des mises à jour importantes sur les heures de service ou les changements au menu",
          "Pour tenir des registres à des fins opérationnelles et de conformité",
          "Pour analyser les habitudes d'utilisation et améliorer notre plateforme",
          "Pour prévenir la fraude et assurer la sécurité du système"
        ]
      },
      share: {
        title: "4. Partage de vos renseignements",
        desc: "Nous ne vendons, n'échangeons ni ne louons vos renseignements personnels à des tiers. Nous pouvons partager vos renseignements uniquement dans les circonstances suivantes :",
        admin: {
          title: "Administration du Collège",
          desc: "Lorsque requis à des fins de rapports institutionnels ou de conformité"
        },
        emergency: {
          title: "Situations d'urgence",
          desc: "Pour protéger la santé et la sécurité en cas d'allergies alimentaires ou d'urgences médicales"
        }
      },
      security: {
        title: "5. Sécurité des données",
        desc: "Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos renseignements personnels contre l'accès non autorisé, la modification, la divulgation ou la destruction. Ces mesures comprennent :",
        items: [
          "Le cryptage (chiffrement) des données en transit et au repos",
          "Des audits de sécurité et une surveillance réguliers",
          "Des contrôles d'accès et des exigences d'authentification",
          "Des procédures sécuritaires de sauvegarde et de récupération",
          "La formation des employés sur les pratiques de protection des données"
        ],
        warning: "Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100 %. Bien que nous nous efforcions de protéger vos renseignements personnels, nous ne pouvons en garantir la sécurité absolue."
      },
      retention: {
        title: "6. Conservation des données",
        desc: "Nous conservons vos renseignements personnels aussi longtemps que nécessaire pour remplir les objectifs décrits dans la présente politique de confidentialité, à moins qu'une période de conservation plus longue ne soit exigée ou permise par la loi. Plus précisément :",
        items: [
          "Les informations du compte sont conservées tant que votre compte est actif",
          "L'historique des commandes est conservé pendant 2 ans à des fins opérationnelles et de production de rapports",
          "Les dossiers de paiement sont conservés conformément aux exigences des réglementations financières",
          "Les données analytiques peuvent être conservées sous forme agrégée et anonymisée indéfiniment"
        ]
      },
      rights: {
        title: "7. Vos droits en matière de confidentialité",
        desc: "Vous avez les droits suivants concernant vos renseignements personnels :",
        items: {
          access: { title: "Accès", desc: "Demander une copie des renseignements personnels que nous détenons à votre sujet" },
          correction: { title: "Correction", desc: "Demander la correction de renseignements inexacts ou incomplets" },
          deletion: { title: "Suppression", desc: "Demander la suppression de vos renseignements personnels (sous réserve d'obligations légales)" },
          portability: { title: "Portabilité des données", desc: "Recevoir vos données dans un format structuré et lisible par machine" },
          optOut: { title: "Retrait", desc: "Vous désabonner des communications marketing" },
          restriction: { title: "Restriction", desc: "Demander la restriction du traitement dans certaines circonstances" }
        },
        contactBold: "Pour exercer l'un de ces droits,",
        contactRest: "veuillez visiter le personnel du département de cuisine au local L1170."
      },
      changes: {
        title: "8. Modifications à cette politique de confidentialité",
        p1: "Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page et en mettant à jour la date de « Dernière mise à jour » au haut de ce document.",
        p2: "On vous conseille de consulter cette politique de confidentialité périodiquement pour prendre connaissance de tout changement. Les modifications apportées à cette politique entrent en vigueur au moment de leur publication sur cette page."
      }
    }
  },
  terms: {
    title: "Conditions d'utilisation",
    subtitle: "Veuillez lire attentivement ces conditions avant d'utiliser Gourmet2Go",
    lastUpdated: "Dernière mise à jour : {{date}}",
    sections: {
      agreement: {
        title: "1. Acceptation des conditions",
        p1: "Bienvenue sur Gourmet2Go. En accédant à notre plateforme de commande de nourriture en ligne ou en l'utilisant, vous acceptez d'être lié par ces conditions d'utilisation et par toutes les lois et réglementations applicables. Si vous n'êtes pas d'accord avec l'une de ces conditions, il vous est interdit d'utiliser ou d'accéder à ce service.",
        p2: "Ces conditions d'utilisation s'appliquent à tous les utilisateurs de la plateforme, incluant les étudiants, le corps professoral, le personnel et l'administration du Sault College."
      },
      account: {
        title: "2. Inscription au compte et admissibilité",
        p1: "Pour utiliser Gourmet2Go, vous devez :",
        items: [
          "Être actuellement un étudiant, un membre du corps professoral ou du personnel du Sault College",
          "Fournir des renseignements exacts, à jour et complets lors de l'inscription",
          "Assurer la sécurité du mot de passe de votre compte",
          "Nous aviser immédiatement de toute utilisation non autorisée de votre compte",
          "Être responsable de toutes les activités qui se déroulent sous votre compte"
        ],
        p2: "Nous nous réservons le droit de suspendre ou de fermer les comptes qui enfreignent ces conditions ou qui sont associés à des activités frauduleuses."
      },
      policies: {
        title: "3. Politiques de commande",
        limits: {
          title: "Limites de commande",
          items: [
            "• Une seule commande active par personne à la fois",
            "• Maximum de 5 articles au total par commande",
            "• Commandes sujettes à la disponibilité des articles"
          ]
        },
        deadlines: {
          title: "Heures limites de commande",
          desc: "Les commandes doivent être passées avant 12 h 00 (15 minutes avant le début du service). Les commandes tardives ne seront pas acceptées. Cela permet à notre brigade culinaire d'avoir suffisamment de temps pour préparer votre repas."
        },
        reservations: {
          title: "Réservations",
          desc: "Ajouter des articles à votre panier NE LES RÉSERVE PAS. Les articles sont réservés uniquement lorsque vous passez à la caisse et recevez la confirmation de commande. Les articles réservés non réclamés sont remis en disponibilité après la fermeture."
        }
      },
      payment: {
        title: "4. Modalités de paiement",
        items: [
          "Le paiement est requis lors du ramassage par carte seulement (argent comptant refusé)",
          "Les prix peuvent changer sans préavis",
          "Toutes les ventes sont finales - aucun remboursement sauf en cas de problème de qualité",
          "Les commandes non réclamées ne seront pas remboursées"
        ]
      },
      pickup: {
        title: "5. Exigences de ramassage",
        p1: "Les commandes doivent être récupérées pendant les heures de service prévues :",
        hoursTitle: "Heures de service",
        hours: "Mercredi et jeudi : 12 h 15 - 12 h 45",
        locationTitle: "Lieu",
        location: "Local L1170 - Département de cuisine",
        items: [
          "Vous devez présenter votre carte d'étudiant/d'employé lors du ramassage",
          "Les commandes non récupérées pendant les heures de service seront annulées",
          "Aucun remboursement pour les commandes non réclamées",
          "Vous recevrez un avis par courriel lorsque votre commande sera prête"
        ]
      },
      cancellation: {
        title: "6. Annulation et modification",
        p1: "Les commandes peuvent être modifiées ou annulées via le tableau de bord de votre compte avant l'heure limite quotidienne de 12 h 00. Passé ce délai, les commandes ne peuvent plus être annulées ni modifiées, car la préparation des repas a déjà commencé.",
        warning: "Les annulations tardives (après l'heure limite) ou les absences peuvent entraîner la suspension temporaire de vos privilèges de commande."
      },
      safety: {
        title: "7. Salubrité alimentaire et allergies",
        p1: "Bien que nous fassions tout notre possible pour accommoder les restrictions et allergies alimentaires, notre cuisine manipule des allergènes courants tels que les produits laitiers, les œufs, le blé, le soya, les noix et les fruits de mer. Une contamination croisée peut survenir.",
        important: "Important :",
        warning: " Si vous souffrez d'allergies alimentaires sévères, veuillez consulter notre personnel de cuisine avant de commander. Nous ne pouvons pas garantir des repas sans allergènes.",
        items: [
          "La liste des ingrédients est fournie pour tous les articles du menu",
          "Vous êtes responsable de vérifier les ingrédients avant de commander",
          "Les demandes alimentaires particulières doivent être soumises à l'avance",
          "Nous ne sommes pas responsables des réactions allergiques causées par des allergies non déclarées"
        ]
      },
      prohibited: {
        title: "8. Comportements interdits",
        p1: "Vous acceptez de NE PAS :",
        items: [
          "Créer plusieurs comptes pour contourner les limites de commande",
          "Passer des commandes frauduleuses ou abusives",
          "Partager vos identifiants de compte avec d'autres personnes",
          "Revendre les repas achetés sur Gourmet2Go",
          "Tenter de manipuler les prix ou les stocks",
          "Utiliser des systèmes automatisés pour passer des commandes (bots)",
          "Harceler ou abuser les membres du personnel",
          "Violer les lois ou réglementations applicables"
        ],
        p2: "La violation de ces conditions peut entraîner la fermeture immédiate de votre compte et de possibles mesures disciplinaires par le Sault College."
      },
      liability: {
        title: "9. Limitation de responsabilité",
        p1: "Gourmet2Go et le Sault College ne sauraient être tenus responsables de tout dommage indirect, accessoire, spécial, consécutif ou punitif résultant de votre utilisation ou incapacité à utiliser le service, incluant, sans s'y limiter :",
        items: [
          "Les erreurs ou inexactitudes dans les descriptions du menu",
          "L'indisponibilité des articles du menu",
          "Les interruptions de service ou les problèmes techniques",
          "Les préoccupations concernant la qualité de la nourriture (sous réserve de la garantie de qualité)",
          "Les retards dans la préparation ou le ramassage des commandes"
        ]
      },
      availability: {
        title: "10. Disponibilité du service",
        p1: "Gourmet2Go fonctionne pendant l'année scolaire et peut être fermé lors des :",
        items: [
          "Jours fériés et congés du Collège",
          "Semaines de lecture et périodes d'examens",
          "Session d'été (sauf avis contraire)",
          "Situations d'urgence ou circonstances imprévues"
        ],
        p2: "Nous nous réservons le droit de modifier les heures de service, de suspendre les opérations ou de mettre fin au service en tout temps et sans préavis."
      },
      changes: {
        title: "11. Modifications des conditions",
        p1: "Nous nous réservons le droit de modifier ces conditions d'utilisation en tout temps. Nous informerons les utilisateurs des changements importants par courriel ou par un avis bien en vue sur la plateforme. Le fait de continuer à utiliser Gourmet2Go après ces modifications constitue votre acceptation des conditions mises à jour.",
        p2: "Il est de votre responsabilité de consulter ces conditions périodiquement. La date de « Dernière mise à jour » au haut de cette page indique le moment de la dernière révision des conditions."
      }
    }
  },
  contact: {
    info: {
      pickupLocation: "Lieu de ramassage",
      phone: "Téléphone",
      serviceHours: "Heures de service",
      addressLine1: "443 Northern Ave, Sault Ste. Marie, ON",
      addressLine2: "Salle L1170",
      hoursDays: "Mercredis et jeudis",
      hoursTime: "12 h 15 – 12 h 45"
    },
    form: {
      title: "Envoyez-nous un message",
      name: "Nom",
      email: "Courriel",
      message: "Message",
      placeholders: {
        name: "John Doe",
        email: "john@exemple.com",
        message: "Comment peut-on vous aider aujourd’hui?"
      },
      button: {
        sending: "Envoi en cours...",
        send: "Envoyer le message"
      }
    }
  },
  validation: {
    nameRequired: "Le nom est requis",
    nameMax: "Le nom est trop long (maximum 35 caractères)",
    emailMax: "Le courriel est trop long",
    messageMin: "Le message doit contenir au moins 10 caractères",
    messageMax: "Votre message peut contenir un maximum de 500 caractères"
  },
  feedback: {
    success: "Votre message a été envoyé avec succès!",
    error: "Échec de l’envoi du message. Veuillez réessayer plus tard."
  }
};