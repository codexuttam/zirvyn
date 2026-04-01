import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Zorvyn Finance API',
            version: '1.0.0',
            description: 'Premium API for user and role-based finance management',
            contact: {
                name: 'Zorvyn Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:4000/api',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Files to search for annotations
    apis: ['./src/routes/*.ts', './src/services/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
