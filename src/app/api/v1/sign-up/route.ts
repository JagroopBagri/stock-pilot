import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/server/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, username, email, password } = body;

        // Check if a user already exists with the same username
        const userByUsername = await prisma.users.findFirst({
            where: {
                username: username
            }
        });

        if (userByUsername) {
            // Username already exists
            return NextResponse.json({ error: "Username already exists." }, {
                status: 400
            });
        }

        // Check if a user already exists with the same email
        const userByEmail = await prisma.users.findFirst({
            where: {
                email: email
            }
        });

        if (userByEmail) {
            // Email already exists
            return NextResponse.json({ error: "Email already exists." }, {
                status: 400
            });
        }

        // If no user found, proceed to create a new user
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.users.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
            }
        });

        // Successfully created a new user
        return NextResponse.json(newUser, {
            status: 201
        });
    } catch (error) {
        console.error("Error in user registration: ", error);
        return NextResponse.json({ error: "An error occurred while processing your request." }, {
            status: 500
        });
    }
}