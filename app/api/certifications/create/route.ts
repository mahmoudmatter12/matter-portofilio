import { db } from "@/lib/db";
import { Certification } from "@/types/certificates";

export async function POST(request: Request){
    const newCertificate : Certification = await request.json();
    try {
        if(!newCertificate.name || !newCertificate.issuer || !newCertificate.issueDate) {
            return new Response(
                JSON.stringify({ error: "Name, issuer, and issue date are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Assuming db.certifications.create is a function to save the certificate
        const createdCertificate = await db.certifications.create({
            data: {
                name: newCertificate.name,
                issuer: newCertificate.issuer,
                issueDate: newCertificate.issueDate,
                expiryDate: newCertificate.expiryDate || null,
                description: newCertificate.description || "",
                credentialUrl: newCertificate.credentialUrl || "",
                status: newCertificate.status || "active", // Provide a default or use from input
            },
        });

        return new Response(JSON.stringify(createdCertificate), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch (error) {
        console.error("Error creating certificate:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create certificate" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}