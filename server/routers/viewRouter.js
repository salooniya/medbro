const viewRouter = require('express').Router();
const viewController = require('../controller/viewController');

viewRouter.use(viewController.currentActor);
viewRouter.get('/', viewController.getHome);
viewRouter.get('/login', viewController.getLogin);
viewRouter.get('/users/signup', viewController.getUserSignup);
viewRouter.get('/doctors/signup', viewController.getDoctorSignup);
viewRouter.get('/reset-password', viewController.getResetPassword);
viewRouter.get('/verify-email', viewController.getVerifyEmail);
viewRouter.get('/terms-of-service', viewController.getTermsOfService);
viewRouter.get('/privacy-policy', viewController.getPrivacyPolicy);

viewRouter.get('/logout', viewController.getLogout);

viewRouter.post('/api/login', viewController.postLogin);
viewRouter.get('/doctors/:id/profile', viewController.getDoctorProfile);
viewRouter.get('/doctors/:id/clinic', viewController.getDoctorClinic);
viewRouter.get('/doctors/:id/appointments', viewController.getDoctorAppointments);
viewRouter.post('/doctors/:id/book-appointment', viewController.bookAppointment);
viewRouter.post('/appointments/:id/accepted', viewController.patchAppointmentAccepted);
viewRouter.post('/doctors/updateMe', viewController.updateMeDoctor);
viewRouter.get('/doctors/:id', viewController.getDoctor);
viewRouter.get('/search', viewController.getSearch);

viewRouter.post('/users/updateMe', viewController.updateMeUser);
viewRouter.get('/users/:id/profile', viewController.getUserProfile);
viewRouter.get('/users/:id/appointments', viewController.getUserAppointments);

module.exports = viewRouter;
