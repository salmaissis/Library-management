# 📚 Système de Gestion de Bibliothèque

Application REST développée avec **Spring Boot** permettant de gérer une bibliothèque. Elle offre la gestion des livres, des auteurs et des emprunts, ainsi que des fonctionnalités de recherche, de filtrage et de statistiques afin de faciliter le suivi de l'activité de la bibliothèque.

---

## 🚀 Fonctionnalités

### 📖 Gestion des livres
- Ajouter un livre
- Modifier un livre
- Supprimer un livre
- Consulter la liste des livres
- Consulter les détails d'un livre
- Marquer un livre comme disponible ou indisponible
- Rechercher des livres par :
  - Catégorie
  - Auteur
  - Disponibilité

### ✍️ Gestion des auteurs
- Ajouter un auteur
- Modifier un auteur
- Supprimer un auteur
- Consulter la liste des auteurs
- Consulter les détails d'un auteur

### 📦 Gestion des emprunts
- Enregistrer un nouvel emprunt
- Enregistrer le retour d'un livre
- Suivre le statut des emprunts :
  - En cours
  - Retourné
  - En retard
- Rechercher les emprunts par :
  - Statut
  - Période

### 📊 Statistiques
- Nombre d'emprunts par mois
- Auteurs les plus empruntés
- Taux de retard

---

## 🛠️ Technologies utilisées

- Java 21
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Hibernate
- PostgreSQL
- Lombok
- Maven
- Swagger / OpenAPI
- Jakarta Validation

---

## 📁 Structure du projet

```
src/main/java
│
├── config/
├── controller/
├── dto/
├── entity/
├── exception/
├── mapper/
├── repository/
├── service/
│   └── impl/
└── LibraryManagementApplication.java
```

---

## 🗄️ Modèle de données

### Auteur

| Champ | Type |
|--------|------|
| id | Long |
| nom | String |
| nationalite | String |

### Livre

| Champ | Type |
|--------|------|
| id | Long |
| titre | String |
| isbn | String |
| categorie | Category |
| dateParution | LocalDate |
| disponible | Boolean |
| auteur | Auteur |

### Emprunt

| Champ | Type |
|--------|------|
| id | Long |
| dateEmprunt | LocalDate |
| dateRetourPrevue | LocalDate |
| dateRetourReelle | LocalDate |
| statut | BorrowStatus |
| livre | Livre |

---

## 🔗 Relations entre les entités

```
Auteur
   │
   ├───────────────┐
   │               │
@OneToMany      @ManyToOne
   │               │
 Livre ────────────┘
   │
@ManyToOne
   │
Emprunt
```

---

## 🌐 API REST

### Auteurs

| Méthode | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/authors` | Récupérer tous les auteurs |
| GET | `/api/authors/{id}` | Récupérer un auteur par son identifiant |
| POST | `/api/authors` | Ajouter un auteur |
| PUT | `/api/authors/{id}` | Modifier un auteur |
| DELETE | `/api/authors/{id}` | Supprimer un auteur |

---

### Livres

| Méthode | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/books` | Récupérer tous les livres |
| GET | `/api/books/{id}` | Récupérer un livre par son identifiant |
| POST | `/api/books` | Ajouter un livre |
| PUT | `/api/books/{id}` | Modifier un livre |
| DELETE | `/api/books/{id}` | Supprimer un livre |
| GET | `/api/books/category/{category}` | Rechercher par catégorie |
| GET | `/api/books/author/{authorId}` | Rechercher par auteur |
| GET | `/api/books/available` | Lister les livres disponibles |
| PUT | `/api/books/{id}/available` | Marquer un livre comme disponible |
| PUT | `/api/books/{id}/unavailable` | Marquer un livre comme indisponible |

---

### Emprunts

| Méthode | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/borrowings` | Récupérer tous les emprunts |
| GET | `/api/borrowings/{id}` | Récupérer un emprunt par son identifiant |
| POST | `/api/borrowings` | Enregistrer un emprunt |
| PUT | `/api/borrowings/{id}` | Modifier un emprunt |
| DELETE | `/api/borrowings/{id}` | Supprimer un emprunt |
| PUT | `/api/borrowings/{id}/return` | Enregistrer le retour d'un livre |
| GET | `/api/borrowings/status/{status}` | Rechercher par statut |
| GET | `/api/borrowings/period` | Rechercher par période |

---

### Statistiques

| Méthode | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/statistics/borrowings-per-month` | Nombre d'emprunts par mois |
| GET | `/api/statistics/top-authors` | Auteurs les plus empruntés |
| GET | `/api/statistics/late-rate` | Taux de retard |

---

## 📖 Documentation Swagger

Une fois l'application démarrée, la documentation interactive de l'API est accessible à l'adresse suivante :

```
http://localhost:8080/swagger-ui/index.html
```

---

## ⚙️ Configuration

Configurer la connexion à PostgreSQL dans le fichier :

```
src/main/resources/application.properties
```

Exemple :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/library_db
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe

spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## ▶️ Lancer l'application

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/library-management.git
```

### 2. Accéder au dossier du projet

```bash
cd library-management
```

### 3. Compiler le projet

```bash
mvn clean install
```

### 4. Démarrer l'application

```bash
mvn spring-boot:run
```

L'application sera accessible sur :

```
http://localhost:8080
```

---

## ✅ Règles de gestion

- Un livre ne peut être emprunté que s'il est disponible.
- Lorsqu'un livre est emprunté, il devient automatiquement indisponible.
- Lors du retour d'un livre, celui-ci redevient disponible.
- Si la date prévue de retour est dépassée et que le livre n'a pas été retourné, l'emprunt est automatiquement considéré comme **en retard**.
- Chaque ISBN doit être unique.
- La date de parution d'un livre ne peut pas être postérieure à la date du jour.
- La date de retour prévue doit être postérieure à la date d'emprunt.

---

## 🔮 Améliorations futures

- Authentification avec Spring Security et JWT
- Gestion des rôles (Administrateur / Bibliothécaire)
- Pagination et tri des résultats
- Ajout de couvertures de livres
- Notifications par e-mail pour les retards
- Conteneurisation avec Docker
- Tests unitaires et tests d'intégration
- Interface utilisateur développée avec React

---

## 👨‍💻 Auteur

Projet développé dans le cadre de l'apprentissage de **Spring Boot** afin de mettre en œuvre une architecture REST, les opérations CRUD, la gestion des relations JPA, les recherches avancées et la génération de statistiques sur les emprunts d'une bibliothèque.

## Démo


https://github.com/user-attachments/assets/6d57af4e-8778-4fb1-bd69-13bca5cd9c5b



