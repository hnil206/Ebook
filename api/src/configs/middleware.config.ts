// import { NextFunction, Request, Response } from 'express';
// import { verifyToken } from '../services/auth.service';
// import {RequestHandler } from 'express';
// interface AuthenticatedRequest extends Request {
//   userId?: string;
//   userRole?: string[];
// }
import express from 'express';
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/auth.service';
// interface RequestWithAuth extends Request
// async function authMiddleware(
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction,
// ): Promise<RequestHandler<{}, any, any, any, AuthenticatedRequest> | undefined> {
//   try {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) {
//       res.status(401).send('Authorization header missing');
//       return;
//     }

//     const token = authHeader.replace(/^Bearer\s/, '');
//     if (!token) {
//       res.status(401).send('Token missing');
//       return;
//     }

//     try {
//       const { userId, role } = await verifyToken(token);
//       if (!userId) {
//         res.status(401).send('Invalid userId');
//         return;
//       }
//       res.setHeader('x-user-id', userId);
//       res.setHeader('x-user-role', role.join(','));

//       req.userId = userId;
//       req.userRole = role;
//       next();
//     } catch (error) {
//       res.status(401).send('Invalid token');
//     }
//   } catch (error) {
//     res.status(500).send('Internal Server Error');
//   }
// }

// export default async function roleRequire(handler: RequestHandler, role?: string) {
//   return async function(req:Request, res:Response, next:NextFunction){
//     try {
//       const authResult = await authMiddleware(req, res, next);
//       if (authResult !== undefined) {
//         if (role) {
//           const userRole = authResult.userRole;

//         }
//       }
//     }
//   }

// }

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace(/^Bearer\s/, '');
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const { userId, role } = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: 'Invalid userId' });
    }

    console.log(`userId: ${userId}, role: ${role}`);
    req.userId = userId;
    req.userRole = role;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

function roleRequire(roles?: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, (err) => {
      if (err) {
        return next(err);
      }

      if (roles) {
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        const userRoles = req.userRole || [];
        if (!requiredRoles.some((role) => userRoles.includes(role))) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }
      }

      next();
    });
  };
}

export { authMiddleware };
export default roleRequire;
