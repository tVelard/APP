-- ============================================
-- TrackTraining - Schéma de base de données
-- ============================================

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: profiles (profils utilisateurs)
-- ============================================
-- Liée à auth.users de Supabase
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- Table: workouts (séances d'entraînement)
-- ============================================
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Index pour recherche par utilisateur et date
    CONSTRAINT unique_user_workout_date UNIQUE (user_id, date, name)
);

CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_date ON workouts(date);
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date);

-- ============================================
-- Table: exercises (exercices dans une séance)
-- ============================================
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0, -- Ordre d'affichage
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX idx_exercises_position ON exercises(workout_id, position);

-- ============================================
-- Table: sets (séries d'un exercice)
-- ============================================
CREATE TABLE sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0, -- Ordre d'affichage
    reps INTEGER NOT NULL CHECK (reps >= 0),
    weight DECIMAL(6,2) NOT NULL CHECK (weight >= 0), -- en kg
    rest_time INTEGER, -- temps de repos en secondes (optionnel)
    is_dropset BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_sets_exercise_id ON sets(exercise_id);
CREATE INDEX idx_sets_position ON sets(exercise_id, position);

-- ============================================
-- Table: dropset_entries (sous-séries d'un dropset)
-- ============================================
CREATE TABLE dropset_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    set_id UUID NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0, -- Ordre d'affichage
    reps INTEGER NOT NULL CHECK (reps >= 0),
    weight DECIMAL(6,2) NOT NULL CHECK (weight >= 0), -- en kg
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_dropset_entries_set_id ON dropset_entries(set_id);
CREATE INDEX idx_dropset_entries_position ON dropset_entries(set_id, position);

-- ============================================
-- Fonctions utilitaires
-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
    BEFORE UPDATE ON workouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sets_updated_at
    BEFORE UPDATE ON sets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Fonction pour créer un profil automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, display_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil à l'inscription
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropset_entries ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Policies pour workouts
CREATE POLICY "Users can view own workouts"
    ON workouts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workouts"
    ON workouts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
    ON workouts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
    ON workouts FOR DELETE
    USING (auth.uid() = user_id);

-- Policies pour exercises (via workout ownership)
CREATE POLICY "Users can view exercises of own workouts"
    ON exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create exercises in own workouts"
    ON exercises FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update exercises in own workouts"
    ON exercises FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete exercises in own workouts"
    ON exercises FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

-- Policies pour sets (via exercise -> workout ownership)
CREATE POLICY "Users can view sets of own exercises"
    ON sets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM exercises
            JOIN workouts ON workouts.id = exercises.workout_id
            WHERE exercises.id = sets.exercise_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create sets in own exercises"
    ON sets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM exercises
            JOIN workouts ON workouts.id = exercises.workout_id
            WHERE exercises.id = sets.exercise_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update sets in own exercises"
    ON sets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM exercises
            JOIN workouts ON workouts.id = exercises.workout_id
            WHERE exercises.id = sets.exercise_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete sets in own exercises"
    ON sets FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM exercises
            JOIN workouts ON workouts.id = exercises.workout_id
            WHERE exercises.id = sets.exercise_id
            AND workouts.user_id = auth.uid()
        )
    );

-- Policies pour dropset_entries (via set -> exercise -> workout ownership)
CREATE POLICY "Users can view dropset entries of own sets"
    ON dropset_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sets
            JOIN exercises ON exercises.id = sets.exercise_id
            JOIN workouts ON workouts.id = exercises.workout_id
            WHERE sets.id = dropset_entries.set_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create dropset entries in own sets"
    ON dropset_entries FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sets
            JOIN exercises ON exercises.id = sets.exercise_id
            JOIN workouts ON workouts.id = exercises.workout_id
            WHERE sets.id = dropset_entries.set_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update dropset entries in own sets"
    ON dropset_entries FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM sets
            JOIN exercises ON exercises.id = sets.exercise_id
            JOIN workouts ON workouts.id = exercises.workout_id
            WHERE sets.id = dropset_entries.set_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete dropset entries in own sets"
    ON dropset_entries FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM sets
            JOIN exercises ON exercises.id = sets.exercise_id
            JOIN workouts ON workouts.id = exercises.workout_id
            WHERE sets.id = dropset_entries.set_id
            AND workouts.user_id = auth.uid()
        )
    );

-- ============================================
-- Fonction pour dupliquer une séance complète
-- ============================================
CREATE OR REPLACE FUNCTION duplicate_workout(
    source_workout_id UUID,
    new_date DATE,
    new_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_workout_id UUID;
    source_workout workouts%ROWTYPE;
    exercise_record RECORD;
    new_exercise_id UUID;
    set_record RECORD;
    new_set_id UUID;
    dropset_record RECORD;
BEGIN
    -- Récupérer la séance source
    SELECT * INTO source_workout FROM workouts WHERE id = source_workout_id;

    -- Vérifier que l'utilisateur possède la séance source
    IF source_workout.user_id != auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Créer la nouvelle séance
    INSERT INTO workouts (user_id, name, date, notes)
    VALUES (
        auth.uid(),
        COALESCE(new_name, source_workout.name),
        new_date,
        source_workout.notes
    )
    RETURNING id INTO new_workout_id;

    -- Dupliquer les exercices
    FOR exercise_record IN
        SELECT * FROM exercises WHERE workout_id = source_workout_id ORDER BY position
    LOOP
        INSERT INTO exercises (workout_id, name, position, notes)
        VALUES (new_workout_id, exercise_record.name, exercise_record.position, exercise_record.notes)
        RETURNING id INTO new_exercise_id;

        -- Dupliquer les sets de chaque exercice
        FOR set_record IN
            SELECT * FROM sets WHERE exercise_id = exercise_record.id ORDER BY position
        LOOP
            INSERT INTO sets (exercise_id, position, reps, weight, rest_time, is_dropset)
            VALUES (new_exercise_id, set_record.position, set_record.reps, set_record.weight, set_record.rest_time, set_record.is_dropset)
            RETURNING id INTO new_set_id;

            -- Si c'est un dropset, dupliquer les entrées
            IF set_record.is_dropset THEN
                FOR dropset_record IN
                    SELECT * FROM dropset_entries WHERE set_id = set_record.id ORDER BY position
                LOOP
                    INSERT INTO dropset_entries (set_id, position, reps, weight)
                    VALUES (new_set_id, dropset_record.position, dropset_record.reps, dropset_record.weight);
                END LOOP;
            END IF;
        END LOOP;
    END LOOP;

    RETURN new_workout_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- En plus du code exécité j'ai fais ca 
-- Ajouter la colonne avatar_url à la table profiles dans Supabase :
--ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
--Créer un bucket de stockage nommé avatars dans Supabase Storage avec les permissions appropriées pour l'upload public.