import { Document, Schema, Model, model, Error } from "mongoose";

export interface IProduct extends Document {
  productId: String;
  name: String;
  userId: String,
  date: Date,
  list: [Object];
}
export const productSchema = new Schema({
  productId: {
    type: String, required: true,
    unique: true
  },
  name: {
    type: String, required: true,
    unique: true
  },
  userId: {
    type: String, required: true,
  },
  date: {
    type: Date, required: true,
  },
  list: [{name:String, qty:Number}]
});



export const Product: Model<IProduct> = model<IProduct>("Product", productSchema);