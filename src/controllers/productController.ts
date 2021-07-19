/* eslint-disable */
import { Request, Response } from "express";
import { Product } from "../models/product";
import * as jwt from "jsonwebtoken";

export class ProductController {

    // route for showing all products in db
    public async getProducts(req: Request, res: Response): Promise<void> {
        const products = await Product.find();
        res.json({ products });
    }

    // route for creating new product
    public async createProduct(req: Request, res: Response): Promise<void> {
        // get userid from token information
        const fullToken = req.headers.authorization.split(" ");
        const token = fullToken[1];
        const decoded = jwt.decode(token);
        // add id to product object
        let toSave = req.body;
        toSave = { ...toSave, userId: decoded.id, date: new Date() };
        // save into db
        try {
        const result = await Product.create(toSave);;
            if (result === null) {
                res.sendStatus(500);
            } else {
                res.status(201).json({ status: 201, data: result });
            }
        } catch(err) {
            console.log("err",err)
             res.status(400).json({ status: 201, data: err.errmsg });
        }
        
    }

    // route for updating one product
    public async updateProduct(req: Request, res: Response): Promise<void> {
        // get userid from token information
        const fullToken = req.headers.authorization.split(" ");
        const token = fullToken[1];
        const decoded = jwt.decode(token);
        // update product info in database
        const product = await Product.findOneAndUpdate({ name: req.params.name,userId:decoded.id }, req.body,{ new:true });
        if (product === null) {
            res.status(400).json({ status: 201, data: "List isn't found or you cannot modify others list." });
        } else {
            res.json({ status: res.status, data: product });
        }
    }

    // route for creating new report with specfici time interval
    public async createReport(req: Request, res: Response): Promise<void> {
        // get userid from token information
        const from = new Date(req.body.startTime)
        const end = new Date(req.body.endTime)
        const fullToken = req.headers.authorization.split(" ");
        const token = fullToken[1];
        const decoded = jwt.decode(token);

        const product = await Product.aggregate([
            { $match: {  "date" : {"$gte": from, "$lte" : end},  "userId": decoded.id } },
            {  $unwind: "$list" },
            {
                 $group: {
                     _id:"$list.name",
                     totalQty:{$sum:"$list.qty"}
                 }
             },
             { 
                 $group: {
                   _id: 0,  
                   list:{ $push:  {name:"$_id",totalQty:"$totalQty"}}
                 }
             },
             {  
                 $project:{list:1,_id:0}
             } ])
        if (product === null) {
            res.status(400).json({ status: 201, data: "No results to show." });
        } else {
            res.json({ status: res.status, data: product });
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<void> {
        const product = await Product.findOneAndDelete({ name: req.params.name });
        if (product === null) {
            res.sendStatus(404);
        } else { 
            res.json({ response: "Shopping list deleted Successfully" });
        } 
    }
}