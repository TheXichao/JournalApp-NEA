<h1>Journal App<h1>

```mermaid
gantt
    title Computing NEA Project Timeline
    dateFormat DD-MM-YYYY


    section Development Overview
    Development          :25-12-2023  , 50d

    section Testing Overview
    Testing                 :01-02-2024, 12d


    section Documentation Overview
    Documentation               :15-01-2024  , 88d




```

# Diagrams

```mermaid
flowchart TD
   App[Journal App]


   Frontend
   Backend


   B1[User]
   B2[Entries]
   B3[JournalApp]


   F1[Pages]
   F2[Local Storage]
   F3[Functions]


   P1[Register]
   P2[Login]
   P3[Write Entry]
   P4[Retrieve Entries]






   d[(Postgres Database)]


   B1 & B2 & B3 -. requests .-> d


   F1 -. uses .-> F3 -. access/updates .-> F2
   F3 -. requests/updates .-> Backend



   App --> Frontend & Backend
   Backend --> B1 & B3 & B2
   Frontend --> F1 & F2 & F3


   B3 --> configurations
   F1 ---> P1 & P2 & P3 & P4






```

```mermaid
---
title: Database Design
---
erDiagram






   MyUser {
       PrimaryKey UserID
       Email Email
       String FistName
       String Surname
       Boolean isAdmin
       String Password


   }


   Entry{
       PrimaryKey EntryID
       ForeignKey JournalID
       String Title
       Date CreationDate
       String data




   }
   Journal{
       PrimaryKey JournalID
       ForeignKey UserID
       Date CreationDate
   }


   MyUser ||--|| Journal : "owns"
   Entry }o--|| Journal : "in"

```

<table><thead><tr><th style="text-align:center;">Value (left)</th><th style="text-align:center;">Value (right)</th><th>Meaning</th></tr></thead><tbody><tr><td style="text-align:center;"><code>|o</code></td><td style="text-align:center;"><code>o|</code></td><td>Zero or one</td></tr><tr><td style="text-align:center;"><code>||</code></td><td style="text-align:center;"><code>||</code></td><td>Exactly one</td></tr><tr><td style="text-align:center;"><code>}o</code></td><td style="text-align:center;"><code>o{</code></td><td>Zero or more (no upper limit)</td></tr><tr><td style="text-align:center;"><code>}|</code></td><td style="text-align:center;"><code>|{</code></td><td>One or more (no upper limit)</td></tr></tbody></table>
