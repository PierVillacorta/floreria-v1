import type { User } from "../types/types";

export const users :User[] = [
    {   
        "id":1,
        "name" : "Bob",
        "email": "admin@gmail.com",
        "password": "admin",
        "role": "admin",
        "status" : "inactive"
    },
    {   
        "id":2,
        "name" : "user",
        "email": "user@gmail.com",
        "password": "user",
        "role": "user",
        "status" : "inactive"
    }
]