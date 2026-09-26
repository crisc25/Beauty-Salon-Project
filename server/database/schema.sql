-- =========================
-- TIPURI ENUM
-- =========================

CREATE TYPE rol_angajat AS ENUM (
    'admin',
    'manager',
    'angajat'
);

CREATE TYPE status_programare AS ENUM (
    'programata',
    'confirmata',
    'finalizata',
    'anulata'
);


-- =========================
-- CATEGORII
-- =========================

CREATE TABLE categorii (
    id_categorie SERIAL PRIMARY KEY,
    nume_categorie VARCHAR(50) UNIQUE NOT NULL,
    descriere TEXT
);


-- =========================
-- CLIENTI
-- =========================

CREATE TABLE clienti (
    id_client SERIAL PRIMARY KEY,
    nume VARCHAR(20) NOT NULL,
    prenume VARCHAR(20) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    parola VARCHAR(255) NOT NULL
);


-- =========================
-- ANGAJATI
-- =========================

CREATE TABLE angajati (
    id_angajat SERIAL PRIMARY KEY,
    nume VARCHAR(20) NOT NULL,
    prenume VARCHAR(20) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    specializare VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    parola VARCHAR(255) NOT NULL,
    rol rol_angajat NOT NULL,
    data_angajarii TIMESTAMP NOT NULL
);


-- =========================
-- SERVICII
-- =========================

CREATE TABLE servicii (
    id_serviciu SERIAL PRIMARY KEY,
    id_categorie INTEGER NOT NULL,
    denumire VARCHAR(30) NOT NULL,
    durata_minute INTEGER NOT NULL,
    pret DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    descriere TEXT,

    CONSTRAINT fk_servicii_categorie
        FOREIGN KEY (id_categorie)
        REFERENCES categorii(id_categorie)
);


-- =========================
-- PROGRAMARI
-- =========================

CREATE TABLE programari (
    id_programare SERIAL PRIMARY KEY,
    id_client INTEGER NOT NULL,
    id_angajat INTEGER NOT NULL,
    id_serviciu INTEGER NOT NULL,
    data_ora TIMESTAMP NOT NULL,
    status status_programare NOT NULL DEFAULT 'programata',

    CONSTRAINT fk_programari_client
        FOREIGN KEY (id_client)
        REFERENCES clienti(id_client),

    CONSTRAINT fk_programari_angajat
        FOREIGN KEY (id_angajat)
        REFERENCES angajati(id_angajat),

    CONSTRAINT fk_programari_serviciu
        FOREIGN KEY (id_serviciu)
        REFERENCES servicii(id_serviciu)
);


-- =========================
-- ANGAJATI_SERVICII
-- =========================

CREATE TABLE angajati_servicii (
    id_angajat INTEGER NOT NULL,
    id_serviciu INTEGER NOT NULL,

    PRIMARY KEY (id_angajat, id_serviciu),

    CONSTRAINT fk_angajati_servicii_angajat
        FOREIGN KEY (id_angajat)
        REFERENCES angajati(id_angajat),

    CONSTRAINT fk_angajati_servicii_serviciu
        FOREIGN KEY (id_serviciu)
        REFERENCES servicii(id_serviciu)
);