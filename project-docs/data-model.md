# Captains of Commerce Data Model

## Core Entities

### User
- `id`: UUID (primary key)
- `email`: String (unique)
- `password`: String (hashed)
- `firstName`: String
- `lastName`: String
- `role`: Enum (Admin, Staff, Volunteer, Donor)
- `phoneNumber`: String (optional)
- `address`: String (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relationships:
  - Donations (one-to-many)
  - EventRegistrations (one-to-many)
  - VolunteerActivities (one-to-many)

### Event
- `id`: UUID (primary key)
- `title`: String
- `description`: Text
- `eventType`: Enum (ToyDrive, FoodDrive, Fundraiser, Other)
- `startDateTime`: DateTime
- `endDateTime`: DateTime
- `location`: String
- `address`: String
- `isVirtual`: Boolean
- `virtualMeetingLink`: String (optional)
- `maxAttendees`: Integer (optional)
- `registrationDeadline`: DateTime (optional)
- `imageUrl`: String (optional)
- `isPublished`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `createdById`: UUID (foreign key to User)
- Relationships:
  - Creator (many-to-one with User)
  - EventRegistrations (one-to-many)
  - EventDonations (one-to-many)

### Donation
- `id`: UUID (primary key)
- `amount`: Decimal
- `currency`: String (default: 'USD')
- `status`: Enum (Pending, Completed, Failed, Refunded)
- `paymentMethod`: Enum (CreditCard, DebitCard, ACH)
- `transactionId`: String
- `isAnonymous`: Boolean
- `message`: Text (optional)
- `eventId`: UUID (foreign key to Event, optional)
- `donorId`: UUID (foreign key to User, optional if anonymous)
- `createdAt`: DateTime
- Relationships:
  - Donor (many-to-one with User)
  - Event (many-to-one with Event, optional)

### EventRegistration
- `id`: UUID (primary key)
- `eventId`: UUID (foreign key to Event)
- `userId`: UUID (foreign key to User)
- `status`: Enum (Registered, Attended, Canceled, NoShow)
- `registrationDate`: DateTime
- `numberOfGuests`: Integer (default: 0)
- `specialRequirements`: Text (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relationships:
  - Event (many-to-one)
  - User (many-to-one)

### InstagramFeed
- `id`: UUID (primary key)
- `title`: String
- `description`: Text (optional)
- `displayOnHomepage`: Boolean
- `postLimit`: Integer (default: 12)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### InstagramIntegration
- `id`: UUID (primary key)
- `accountName`: String
- `accessToken`: String
- `tokenExpiryDate`: DateTime
- `lastFetchDateTime`: DateTime
- `isActive`: Boolean
- `feedId`: UUID (foreign key to InstagramFeed, optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relationships:
  - InstagramFeed (many-to-one, optional)

### VolunteerActivity
- `id`: UUID (primary key)
- `userId`: UUID (foreign key to User)
- `eventId`: UUID (foreign key to Event)
- `role`: String
- `hoursLogged`: Decimal
- `notes`: Text (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relationships:
  - User (many-to-one)
  - Event (many-to-one)

## Supporting Entities

### Content
- `id`: UUID (primary key)
- `title`: String
- `body`: Text
- `slug`: String (unique)
- `contentType`: Enum (Page, BlogPost, Announcement)
- `authorId`: UUID (foreign key to User)
- `isPublished`: Boolean
- `publishedAt`: DateTime (optional)
- `metaTitle`: String (optional, for SEO)
- `metaDescription`: String (optional, for SEO)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relationships:
  - Author (many-to-one with User)

### ContactFormSubmission
- `id`: UUID (primary key)
- `name`: String
- `email`: String
- `phoneNumber`: String (optional)
- `subject`: String
- `message`: Text
- `status`: Enum (New, InProgress, Resolved)
- `assignedToId`: UUID (foreign key to User, optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relationships:
  - AssignedTo (many-to-one with User, optional)

### NewsletterSubscription
- `id`: UUID (primary key)
- `email`: String (unique)
- `firstName`: String (optional)
- `lastName`: String (optional)
- `isActive`: Boolean
- `subscribedAt`: DateTime
- `unsubscribedAt`: DateTime (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Entity Relationships Diagram

```
User 1 --- * Donation
User 1 --- * EventRegistration
User 1 --- * VolunteerActivity
User 1 --- * Content (as Author)

Event 1 --- * EventRegistration
Event 1 --- * Donation (optional)
Event 1 --- * VolunteerActivity
Event * --- 1 User (as Creator)

InstagramIntegration * --- 1 InstagramFeed (optional)

ContactFormSubmission * --- 1 User (as AssignedTo, optional)
```

## Database Considerations

### Indexing Strategy
- Create indexes on all foreign keys
- Create indexes on frequently queried fields:
  - Event dates
  - Donation amounts and dates
  - User email and roles
  - Content slugs

### Constraints
- Enforce referential integrity with foreign key constraints
- Use unique constraints for email addresses, content slugs
- Implement check constraints for:
  - Donation amounts (positive values)
  - Event dates (end date after start date)

### Data Access Patterns
- Events will be frequently accessed by date range and event type
- Donations will be queried by date range and amount for reporting
- Users will be looked up by email and role
- Photos will be queried by gallery and display order

## Schema Implementation with Prisma

```prisma
enum UserRole {
  ADMIN
  STAFF
  VOLUNTEER
  DONOR
}

enum EventType {
  TOY_DRIVE
  FOOD_DRIVE
  FUNDRAISER
  OTHER
}

enum DonationStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  ACH
}

enum RegistrationStatus {
  REGISTERED
  ATTENDED
  CANCELED
  NO_SHOW
}

enum ContentType {
  PAGE
  BLOG_POST
  ANNOUNCEMENT
}

enum ContactFormStatus {
  NEW
  IN_PROGRESS
  RESOLVED
}

model User {
  id                  String               @id @default(uuid())
  email               String               @unique
  password            String
  firstName           String
  lastName            String
  role                UserRole
  phoneNumber         String?
  address             String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
  donations           Donation[]
  eventRegistrations  EventRegistration[]
  volunteerActivities VolunteerActivity[]
  createdEvents       Event[]
  authoredContent     Content[]
  uploadedPhotos      Photo[]
  assignedSubmissions ContactFormSubmission[]
}

model Event {
  id                   String               @id @default(uuid())
  title                String
  description          String
  eventType            EventType
  startDateTime        DateTime
  endDateTime          DateTime
  location             String
  address              String
  isVirtual            Boolean              @default(false)
  virtualMeetingLink   String?
  maxAttendees         Int?
  registrationDeadline DateTime?
  imageUrl             String?
  isPublished          Boolean              @default(false)
  createdAt            DateTime             @default(now())
  updatedAt            DateTime             @updatedAt
  createdById          String
  creator              User                 @relation(fields: [createdById], references: [id])
  registrations        EventRegistration[]
  donations            Donation[]
  volunteerActivities  VolunteerActivity[]

  @@index([createdById])
  @@index([startDateTime, endDateTime])
  @@index([eventType])
}

model Donation {
  id            String         @id @default(uuid())
  amount        Decimal
  currency      String         @default("USD")
  status        DonationStatus
  paymentMethod PaymentMethod
  transactionId String
  isAnonymous   Boolean        @default(false)
  message       String?
  eventId       String?
  donorId       String?
  createdAt     DateTime       @default(now())
  donor         User?          @relation(fields: [donorId], references: [id])
  event         Event?         @relation(fields: [eventId], references: [id])

  @@index([donorId])
  @@index([eventId])
  @@index([createdAt])
  @@index([amount])
}

model EventRegistration {
  id                  String             @id @default(uuid())
  eventId             String
  userId              String
  status              RegistrationStatus
  registrationDate    DateTime           @default(now())
  numberOfGuests      Int                @default(0)
  specialRequirements String?
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
  event               Event              @relation(fields: [eventId], references: [id])
  user                User               @relation(fields: [userId], references: [id])

  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
}

model InstagramFeed {
  id                String               @id @default(uuid())
  title             String
  description       String?
  displayOnHomepage Boolean              @default(true)
  postLimit         Int                  @default(12)
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  integrations      InstagramIntegration[]
}

model InstagramIntegration {
  id               String        @id @default(uuid())
  accountName      String
  accessToken      String
  tokenExpiryDate  DateTime
  lastFetchDateTime DateTime
  isActive         Boolean       @default(true)
  feedId           String?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  feed             InstagramFeed? @relation(fields: [feedId], references: [id])

  @@index([feedId])
}

model VolunteerActivity {
  id         String   @id @default(uuid())
  userId     String
  eventId    String
  role       String
  hoursLogged Decimal
  notes      String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id])
  event      Event    @relation(fields: [eventId], references: [id])

  @@index([userId])
  @@index([eventId])
}

model Content {
  id              String      @id @default(uuid())
  title           String
  body            String
  slug            String      @unique
  contentType     ContentType
  authorId        String
  isPublished     Boolean     @default(false)
  publishedAt     DateTime?
  metaTitle       String?
  metaDescription String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  author          User        @relation(fields: [authorId], references: [id])

  @@index([authorId])
  @@index([contentType])
  @@index([isPublished])
}

model ContactFormSubmission {
  id           String            @id @default(uuid())
  name         String
  email        String
  phoneNumber  String?
  subject      String
  message      String
  status       ContactFormStatus @default(NEW)
  assignedToId String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
  assignedTo   User?             @relation(fields: [assignedToId], references: [id])

  @@index([assignedToId])
  @@index([status])
  @@index([createdAt])
}

model NewsletterSubscription {
  id             String    @id @default(uuid())
  email          String    @unique
  firstName      String?
  lastName       String?
  isActive       Boolean   @default(true)
  subscribedAt   DateTime  @default(now())
  unsubscribedAt DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([email])
  @@index([isActive])
}
```