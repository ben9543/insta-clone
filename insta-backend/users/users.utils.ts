require("dotenv").config();
import { User } from "@prisma/client";
import { JWType } from "./users.types";
import { FileUpload } from "@apollographql/graphql-upload-8-fork";
import fs from "fs";
import jwt from "jsonwebtoken"
import client from "../client";

export const secret = process.env.SECRET || 'secret';

export const getUser = async(token: string) => {
    try {
        if(!token)
            return null;
        const { id } = <JWType>await jwt.verify(token, secret);
        const user = await client.user.findUnique({where:{id}});
        if(user)
            return user;
        else 
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const isLoggedIn = (currentUser: User) => {
    if(!currentUser)
        throw new Error("No user logged in. Check the token.");
}

export const checkUndefined = (arr: Array<any>): boolean => {
    for(let item of arr){
        if(typeof item !== undefined)
            return false;
    }
    return true;
}

export const checkNull = (arr: Array<any>): boolean => {
    for(let item of arr){
        if(typeof item === null)
            return true;
    }
    return false;
}

export const checkType = (arr: Array<any>, type: string): boolean => {
    for(let item of arr){
        if(typeof item !== type)
            return false;
    }
    return true;
}

export const removeWhitespaces = (str: string | undefined): string | undefined => {
    if(typeof str === 'string')
        return str.trim().replace(/\s/g, '');
    return undefined;
};

export const saveAvatarDemo = async(avatar: FileUpload, userId:string|number):Promise<string> => {
    try {
        
    
    const { filename, createReadStream } = await avatar;
    
    const serverpath = process.env.STATIC_PATH || `http://localhost:${process.env.PORT ? process.env.PORT : "4000"}`;
    const dirpath = `${process.cwd()}\\uploads\\${userId}`;
    const filepath = `${userId}\\${Date.now()}-${filename}`;
    const staticpath = `${serverpath}\\static\\${filepath}`;

    fs.mkdirSync(dirpath, { recursive: true });
    const readStream = createReadStream();
    const writeStream = fs.createWriteStream("uploads\\" + filepath);

    readStream.pipe(writeStream);
    return staticpath;

    } catch (error) {
        console.log(error)
        return error
    }
    
}