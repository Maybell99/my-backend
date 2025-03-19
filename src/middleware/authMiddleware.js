const authMiddleware = (req, res, next) => {
    console.log("Auth Middleware: User authenticated"); 
    next();
  };
  
  export default authMiddleware;
  