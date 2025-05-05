import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    submit: 'Submit',
    back: 'Back'
  },
  auth: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    twoFactorAuth: 'Two-Factor Authentication',
    verifyCode: 'Verify Code'
  },
  roles: {
    contractor: 'Contractor',
    vendor: 'Vendor',
    subcontractor: 'Subcontractor',
    customer: 'Customer'
  },
  projects: {
    title: 'Projects',
    newProject: 'New Project',
    projectDetails: 'Project Details',
    budget: 'Budget',
    timeline: 'Timeline',
    status: {
      draft: 'Draft',
      bidding: 'Bidding',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  },
  bids: {
    title: 'Bids',
    newBid: 'New Bid',
    bidDetails: 'Bid Details',
    amount: 'Amount',
    timeline: 'Timeline',
    status: {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected'
    }
  },
  materials: {
    title: 'Materials',
    newMaterial: 'New Material',
    inventory: 'Inventory',
    stock: 'Stock',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    price: 'Price'
  },
  tasks: {
    title: 'Tasks',
    newTask: 'New Task',
    taskDetails: 'Task Details',
    assignTo: 'Assign To',
    dueDate: 'Due Date',
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    },
    status: {
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      blocked: 'Blocked'
    }
  },
  messages: {
    title: 'Messages',
    newMessage: 'New Message',
    send: 'Send',
    reply: 'Reply',
    attachment: 'Attachment'
  },
  notifications: {
    title: 'Notifications',
    markAsRead: 'Mark as Read',
    clearAll: 'Clear All'
  }
};

// French translations
const frTranslations = {
  common: {
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Succès',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    submit: 'Soumettre',
    back: 'Retour'
  },
  auth: {
    login: 'Connexion',
    register: 'Inscription',
    email: 'Courriel',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié?',
    resetPassword: 'Réinitialiser le mot de passe',
    twoFactorAuth: 'Authentification à deux facteurs',
    verifyCode: 'Vérifier le code'
  },
  roles: {
    contractor: 'Entrepreneur',
    vendor: 'Fournisseur',
    subcontractor: 'Sous-traitant',
    customer: 'Client'
  },
  projects: {
    title: 'Projets',
    newProject: 'Nouveau projet',
    projectDetails: 'Détails du projet',
    budget: 'Budget',
    timeline: 'Calendrier',
    status: {
      draft: 'Brouillon',
      bidding: 'Appel d\'offres',
      inProgress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé'
    }
  },
  bids: {
    title: 'Soumissions',
    newBid: 'Nouvelle soumission',
    bidDetails: 'Détails de la soumission',
    amount: 'Montant',
    timeline: 'Calendrier',
    status: {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Rejetée'
    }
  },
  materials: {
    title: 'Matériaux',
    newMaterial: 'Nouveau matériau',
    inventory: 'Inventaire',
    stock: 'Stock',
    lowStock: 'Stock bas',
    outOfStock: 'Rupture de stock',
    price: 'Prix'
  },
  tasks: {
    title: 'Tâches',
    newTask: 'Nouvelle tâche',
    taskDetails: 'Détails de la tâche',
    assignTo: 'Assigner à',
    dueDate: 'Date d\'échéance',
    priority: {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute'
    },
    status: {
      pending: 'En attente',
      inProgress: 'En cours',
      completed: 'Terminée',
      blocked: 'Bloquée'
    }
  },
  messages: {
    title: 'Messages',
    newMessage: 'Nouveau message',
    send: 'Envoyer',
    reply: 'Répondre',
    attachment: 'Pièce jointe'
  },
  notifications: {
    title: 'Notifications',
    markAsRead: 'Marquer comme lu',
    clearAll: 'Tout effacer'
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export const changeLanguage = (language) => {
  localStorage.setItem('language', language);
  return i18n.changeLanguage(language);
};

export default i18n;
