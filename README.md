# FIMWI - Inventory Management System

FIMWI is a modern web application for managing inventory, suppliers, customers, and invoices. Built with Angular and Material Design, it provides a user-friendly interface for all your inventory management needs.

## Features

- **Inventory Management**
  - Product catalog with detailed information
  - Batch tracking and management
  - Stock level monitoring
  - Low stock alerts

- **Supplier Management**
  - Supplier directory
  - Purchase order management
  - Supplier performance tracking

- **Customer Management**
  - Customer directory
  - Customer order history
  - Customer relationship management

- **Invoice Management**
  - Create and manage invoices
  - Track payment status
  - Generate reports

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Angular CLI (v17 or later)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fimwi.git
   cd fimwi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment:
   - Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
   - Update the API URL in the environment file

## Development

Run the development server:
```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Building

Build the project:
```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

Run unit tests:
```bash
ng test
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── layout/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── suppliers/
│   │   ├── customers/
│   │   └── invoices/
│   ├── shared/
│   └── app.component.ts
├── assets/
└── environments/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@fimwi.com or open an issue in the repository.
