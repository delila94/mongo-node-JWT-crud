import { Request,Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user";
import { JWT_SECRET } from "../util/secrets";
import bcrypt from "bcryptjs";

export class UserController {

  // route for registering user
  public async registerUser(req: Request, res: Response) {
    const { email, password } = req.body
    if(!email || !password) 
    return res.status(400).send({msg:'To register please provide both email and password'})

      const findUser = await User.findOne({
          email: email
      })
      if (findUser)
          return res.status(400).send({
              msg: 'User with this email address already exists'
          })
      // check if entered email is vaild
      const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      const validateEmail= re.test(String(email).toLowerCase());
      if(!validateEmail)
         return res.status(400).send({
        msg: 'You must provide valid email address.'
        })
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(password, salt)
      const newUser = await User.create({
          email: email,
          password: hashedPassword
      });
      const token = jwt.sign({
          email: email,
          id: newUser._id
      }, JWT_SECRET);
      res.status(200).send({
          token: token
      });
  }

  // route for login user
  public async authenticateUser(req: Request, res: Response) {
      const { email, password } = req.body
      if(!email || !password) 
      return res.json({msg:'To login please provide both email and password'})
      try {
          const currentUser = await User.findOne({
              email: email
          })
          if (!currentUser)
              return res.status(400).json({
                  msg: 'No user with this email found'
              })
          const match = await bcrypt.compare(password, currentUser.password)
          if (!match)
              return res.status(400).json({
                  msg: 'Incorrect password try again'
              })
          const token = jwt.sign({
              email: req.body.email,
              id: currentUser._id
          }, JWT_SECRET, {
              expiresIn: 60 * 60
          });
          res.status(200).send({
              token: token
          });
      } catch (err) {
          res.json({
              msg: err.message
          })
      }
  }

  // route for changing the password
  public async modifyPassword(req: Request, res: Response) {
      const { email, oldPassword, newPassword } = req.body
      if (email && oldPassword && newPassword) {
          if (oldPassword === newPassword)
              return res.status(400).json({
                  msg: 'Old password must be different than new password.'
              })
          try {
              const currentUser = await User.findOne({
                  email: email
              })
              const match = await bcrypt.compare(oldPassword, currentUser.password)
              if (!match)
                  return res.status(400).json({
                      msg: 'Incorrect old password try again'
                  })
              const salt = await bcrypt.genSalt()
              const hashedPassword = await bcrypt.hash(newPassword, salt)
              const result = await User.updateOne({
                  email: email
              }, {
                  $set: {
                      password: hashedPassword
                  }
              })
              if (result && result.ok === 1)
                  res.json({
                      msg: 'Password changed successfully'
                  })
              console.log("result", result)
          } catch (err) {
              res.json({
                  msg: err.message
              })
          }
      } else {
          res.json({
              msg: 'You must provide email, old password and new password.'
          })
      }
  }

}