--
-- PostgreSQL database dump
--

\restrict tcOsqoaZ5wswPhNzMZyfRdmdrQslqzU2TMKutv0mneaKhy7bRn8elQwzcDkIJ5d

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.rider_horse_pairings DROP CONSTRAINT IF EXISTS rider_horse_associations_rider_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rider_horse_pairings DROP CONSTRAINT IF EXISTS rider_horse_associations_horse_id_fkey;
ALTER TABLE IF EXISTS ONLY public.recurrence_participants DROP CONSTRAINT IF EXISTS recurrence_participants_rider_fkey;
ALTER TABLE IF EXISTS ONLY public.recurrence_participants DROP CONSTRAINT IF EXISTS recurrence_participants_recurrence_fkey;
ALTER TABLE IF EXISTS ONLY public.recurrence_participants DROP CONSTRAINT IF EXISTS recurrence_participants_horse_fkey;
ALTER TABLE IF EXISTS ONLY public.planning_slots DROP CONSTRAINT IF EXISTS planning_slots_event_id_fkey;
ALTER TABLE IF EXISTS ONLY public.packages DROP CONSTRAINT IF EXISTS fk_packages_rider;
ALTER TABLE IF EXISTS ONLY public.event_participants DROP CONSTRAINT IF EXISTS fk_event_participants_slot;
ALTER TABLE IF EXISTS ONLY public.event_participants DROP CONSTRAINT IF EXISTS fk_event_participants_rider;
ALTER TABLE IF EXISTS ONLY public.event_participants DROP CONSTRAINT IF EXISTS fk_event_participants_horse;
DROP INDEX IF EXISTS public.unique_recurrence_participant;
DROP INDEX IF EXISTS public.unique_active_package_per_rider;
DROP INDEX IF EXISTS public.idx_riders_active;
DROP INDEX IF EXISTS public.idx_rider_horse_pairings_rider_id;
DROP INDEX IF EXISTS public.idx_rider_horse_pairings_horse_id;
DROP INDEX IF EXISTS public.idx_rhp_loan_days_gin;
DROP INDEX IF EXISTS public.idx_planning_slots_date;
DROP INDEX IF EXISTS public.idx_packages_dates;
DROP INDEX IF EXISTS public.idx_events_type;
DROP INDEX IF EXISTS public.idx_event_participants_slot;
DROP INDEX IF EXISTS public.idx_event_participants_rider_id;
DROP INDEX IF EXISTS public.idx_event_participants_rider;
DROP INDEX IF EXISTS public.idx_event_participants_horse_id;
DROP INDEX IF EXISTS public.idx_event_participants_active;
ALTER TABLE IF EXISTS ONLY public.rider_horse_pairings DROP CONSTRAINT IF EXISTS unique_rider_horse_period;
ALTER TABLE IF EXISTS ONLY public.riders DROP CONSTRAINT IF EXISTS riders_pkey;
ALTER TABLE IF EXISTS ONLY public.riders DROP CONSTRAINT IF EXISTS riders_phone_key;
ALTER TABLE IF EXISTS ONLY public.riders DROP CONSTRAINT IF EXISTS riders_id_key;
ALTER TABLE IF EXISTS ONLY public.riders DROP CONSTRAINT IF EXISTS riders_email_key;
ALTER TABLE IF EXISTS ONLY public.rider_monthly_billing_frozen DROP CONSTRAINT IF EXISTS rider_monthly_billing_pk;
ALTER TABLE IF EXISTS ONLY public.rider_horse_pairings DROP CONSTRAINT IF EXISTS rider_horse_pairings_pkey;
ALTER TABLE IF EXISTS ONLY public.rider_horse_pairings DROP CONSTRAINT IF EXISTS rider_horse_pairings_id_key;
ALTER TABLE IF EXISTS ONLY public.recurrences DROP CONSTRAINT IF EXISTS recurrences_pkey;
ALTER TABLE IF EXISTS ONLY public.recurrence_participants DROP CONSTRAINT IF EXISTS recurrence_participants_pkey;
ALTER TABLE IF EXISTS ONLY public.planning_slots DROP CONSTRAINT IF EXISTS planning_slots_pkey;
ALTER TABLE IF EXISTS ONLY public.planning_slots DROP CONSTRAINT IF EXISTS planning_slots_id_key;
ALTER TABLE IF EXISTS ONLY public.packages DROP CONSTRAINT IF EXISTS packages_pkey;
ALTER TABLE IF EXISTS ONLY public.packages DROP CONSTRAINT IF EXISTS packages_id_key;
ALTER TABLE IF EXISTS ONLY public.horses DROP CONSTRAINT IF EXISTS horses_pkey;
ALTER TABLE IF EXISTS ONLY public.horses DROP CONSTRAINT IF EXISTS horses_name_key;
ALTER TABLE IF EXISTS ONLY public.horses DROP CONSTRAINT IF EXISTS horses_id_key;
ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS events_pkey;
ALTER TABLE IF EXISTS ONLY public.event_participants DROP CONSTRAINT IF EXISTS event_participants_pkey;
DROP VIEW IF EXISTS public.rider_usage_weekly;
DROP VIEW IF EXISTS public.rider_usage_live;
DROP VIEW IF EXISTS public.rider_monthly_billing;
DROP VIEW IF EXISTS public.rider_monthly_billing_live;
DROP TABLE IF EXISTS public.rider_monthly_billing_frozen;
DROP TABLE IF EXISTS public.rider_horse_pairings;
DROP TABLE IF EXISTS public.recurrences;
DROP TABLE IF EXISTS public.recurrence_participants;
DROP TABLE IF EXISTS public.packages;
DROP VIEW IF EXISTS public.event_details_live;
DROP TABLE IF EXISTS public.riders;
DROP TABLE IF EXISTS public.planning_slots;
DROP TABLE IF EXISTS public.horses;
DROP TABLE IF EXISTS public.events;
DROP TABLE IF EXISTS public.event_participants;
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.get_or_create_rider(rider_name text);
DROP FUNCTION IF EXISTS public.get_or_create_horse(horse_name text);
DROP FUNCTION IF EXISTS public.freeze_last_billing_month();
DROP FUNCTION IF EXISTS public.calculate_end_time(start_time time without time zone, duration_minutes integer);
DROP TYPE IF EXISTS public.slot_status;
DROP TYPE IF EXISTS public.rider_type;
DROP TYPE IF EXISTS public.rider_horse_link_type;
DROP TYPE IF EXISTS public.recurrence_frequency;
DROP TYPE IF EXISTS public.owner_type;
DROP TYPE IF EXISTS public.horse_type;
DROP TYPE IF EXISTS public.horse_assignment_type;
DROP TYPE IF EXISTS public.event_type;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: event_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.event_type AS ENUM (
    'private_lesson',
    'special',
    'blocked',
    'service',
    'loaner_free_time',
    'grouped_lesson',
    'competition'
);


ALTER TYPE public.event_type OWNER TO postgres;

--
-- Name: TYPE event_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TYPE public.event_type IS 'Type of event: lesson, generic event, blocked slot, service, or loaner free time';


--
-- Name: horse_assignment_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.horse_assignment_type AS ENUM (
    'manual',
    'automatic'
);


ALTER TYPE public.horse_assignment_type OWNER TO postgres;

--
-- Name: horse_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.horse_type AS ENUM (
    'pony',
    'horse'
);


ALTER TYPE public.horse_type OWNER TO postgres;

--
-- Name: owner_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.owner_type AS ENUM (
    'laury',
    'private_owner',
    'club',
    'other'
);


ALTER TYPE public.owner_type OWNER TO postgres;

--
-- Name: recurrence_frequency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.recurrence_frequency AS ENUM (
    'daily',
    'weekly',
    'monthly'
);


ALTER TYPE public.recurrence_frequency OWNER TO postgres;

--
-- Name: rider_horse_link_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rider_horse_link_type AS ENUM (
    'own',
    'loan'
);


ALTER TYPE public.rider_horse_link_type OWNER TO postgres;

--
-- Name: rider_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rider_type AS ENUM (
    'owner',
    'club',
    'boarder',
    'loaner'
);


ALTER TYPE public.rider_type OWNER TO postgres;

--
-- Name: slot_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.slot_status AS ENUM (
    'scheduled',
    'confirmed',
    'completed',
    'cancelled'
);


ALTER TYPE public.slot_status OWNER TO postgres;

--
-- Name: calculate_end_time(time without time zone, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_end_time(start_time time without time zone, duration_minutes integer) RETURNS time without time zone
    LANGUAGE plpgsql IMMUTABLE
    AS $$
BEGIN
    RETURN start_time + (duration_minutes || ' minutes')::INTERVAL;
END;
$$;


ALTER FUNCTION public.calculate_end_time(start_time time without time zone, duration_minutes integer) OWNER TO postgres;

--
-- Name: freeze_last_billing_month(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.freeze_last_billing_month() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO rider_monthly_billing_frozen
  SELECT *
  FROM rider_monthly_billing_live
  WHERE month_start = date_trunc('month', current_date) - INTERVAL '1 month'
  ON CONFLICT (rider_id, month_start) DO NOTHING;
END;
$$;


ALTER FUNCTION public.freeze_last_billing_month() OWNER TO postgres;

--
-- Name: get_or_create_horse(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_or_create_horse(horse_name text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    hid integer;
BEGIN
    SELECT id INTO hid
    FROM public.horses
    WHERE unaccent(name) ILIKE '%' || unaccent(horse_name) || '%'
    LIMIT 1;

    IF hid IS NULL THEN
        INSERT INTO public.horses (name, kind, ownership_type)
        VALUES (horse_name, 'pony', 'club')
        RETURNING id INTO hid;
    END IF;

    RETURN hid;
END;
$$;


ALTER FUNCTION public.get_or_create_horse(horse_name text) OWNER TO postgres;

--
-- Name: get_or_create_rider(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_or_create_rider(rider_name text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    rid integer;
BEGIN
    SELECT id INTO rid
    FROM public.riders
    WHERE unaccent(name) ILIKE '%' || unaccent(rider_name) || '%'
    LIMIT 1;

    IF rid IS NULL THEN
        INSERT INTO public.riders (name, rider_type)
        VALUES (rider_name, 'loaner')
        RETURNING id INTO rid;
    END IF;

    RETURN rid;
END;
$$;


ALTER FUNCTION public.get_or_create_rider(rider_name text) OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: event_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_participants (
    id integer NOT NULL,
    planning_slot_id integer NOT NULL,
    rider_id integer,
    horse_id integer,
    horse_assignment_type public.horse_assignment_type NOT NULL,
    is_cancelled boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.event_participants OWNER TO postgres;

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    event_type public.event_type NOT NULL,
    instructor_id integer,
    min_participants integer,
    max_participants integer,
    deleted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name text DEFAULT ''::text,
    CONSTRAINT events_max_participants_check CHECK ((max_participants >= 0)),
    CONSTRAINT events_min_participants_check CHECK ((min_participants >= 0))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: TABLE events; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.events IS 'Events or lessons scheduled in planning slots';


--
-- Name: COLUMN events.event_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.events.event_type IS 'Type of event or lesson';


--
-- Name: COLUMN events.instructor_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.events.instructor_id IS 'Instructor scheduled for this event';


--
-- Name: COLUMN events.min_participants; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.events.min_participants IS 'Minimum number of participants';


--
-- Name: COLUMN events.max_participants; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.events.max_participants IS 'Maximum number of participants';


--
-- Name: COLUMN events.deleted_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.events.deleted_at IS 'Soft delete timestamp';


--
-- Name: COLUMN events.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.events.created_at IS 'Record creation timestamp';


--
-- Name: COLUMN events.updated_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.events.updated_at IS 'Record last updated timestamp';


--
-- Name: horses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horses (
    id integer NOT NULL,
    name character varying NOT NULL,
    kind public.horse_type NOT NULL,
    activity_start_date date,
    activity_end_date date,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    ownership_type public.owner_type NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.horses OWNER TO postgres;

--
-- Name: COLUMN horses.deleted_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.horses.deleted_at IS 'Soft delete timestamp';


--
-- Name: planning_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planning_slots (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    slot_status public.slot_status NOT NULL,
    actual_instructor_id integer,
    cancellation_reason text,
    is_all_day boolean NOT NULL,
    slot_date date DEFAULT now(),
    start_time time without time zone,
    end_time time without time zone,
    event_id integer NOT NULL
);


ALTER TABLE public.planning_slots OWNER TO postgres;

--
-- Name: COLUMN planning_slots.deleted_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.planning_slots.deleted_at IS 'Soft delete timestamp';


--
-- Name: riders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.riders (
    id integer NOT NULL,
    name character varying NOT NULL,
    phone character varying,
    email character varying,
    activity_start_date date,
    activity_end_date date,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    rider_type public.rider_type NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.riders OWNER TO postgres;

--
-- Name: COLUMN riders.deleted_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.riders.deleted_at IS 'Soft delete timestamp';


--
-- Name: event_details_live; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.event_details_live AS
 WITH month_context AS (
         SELECT (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))::date AS month_start,
            ((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval))::date AS month_end
        ), weeks AS (
         SELECT (d.d)::date AS week_start
           FROM generate_series(date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone), (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval), '1 day'::interval) d(d)
          WHERE (EXTRACT(isodow FROM d.d) = (1)::numeric)
        ), valid_events AS (
         SELECT ps.id AS planning_slot_id,
            e.id AS event_id,
            e.event_type,
            e.name AS event_name,
            ps.slot_date,
            (date_trunc('week'::text, (ps.slot_date)::timestamp with time zone))::date AS week_start,
            ps.start_time,
            ps.end_time,
            ps.is_all_day,
            e.instructor_id,
            ps.actual_instructor_id
           FROM ((public.planning_slots ps
             JOIN public.events e ON ((e.id = ps.event_id)))
             JOIN month_context m ON (true))
          WHERE ((ps.deleted_at IS NULL) AND (ps.slot_status <> 'cancelled'::public.slot_status) AND (e.deleted_at IS NULL) AND (ps.slot_date >= m.month_start) AND (ps.slot_date <= m.month_end))
        ), event_participants_detail AS (
         SELECT ve.planning_slot_id,
            ve.event_id,
            ve.event_type,
            ve.event_name,
            ve.slot_date,
            ve.week_start,
            ve.start_time,
            ve.end_time,
            ve.is_all_day,
            ve.instructor_id,
            ve.actual_instructor_id,
            ep.rider_id,
            r.name AS rider_name,
            ep.horse_id,
            h.name AS horse_name,
            h.ownership_type AS horse_ownership_type
           FROM (((valid_events ve
             LEFT JOIN public.event_participants ep ON (((ep.planning_slot_id = ve.planning_slot_id) AND (ep.is_cancelled = false))))
             LEFT JOIN public.riders r ON ((r.id = ep.rider_id)))
             LEFT JOIN public.horses h ON ((h.id = ep.horse_id)))
        ), event_counts AS (
         SELECT event_participants_detail.event_type,
            event_participants_detail.week_start,
            count(DISTINCT event_participants_detail.planning_slot_id) AS events_count_week,
            count(DISTINCT event_participants_detail.rider_id) AS riders_count_week,
            count(DISTINCT event_participants_detail.horse_id) AS horses_count_week,
            count(DISTINCT event_participants_detail.horse_id) FILTER (WHERE (event_participants_detail.horse_ownership_type = 'private_owner'::public.owner_type)) AS private_owner_horses_count_week,
            count(DISTINCT event_participants_detail.horse_id) FILTER (WHERE (event_participants_detail.horse_ownership_type = 'laury'::public.owner_type)) AS laury_horses_count_week,
            count(DISTINCT event_participants_detail.horse_id) FILTER (WHERE (event_participants_detail.horse_ownership_type = 'club'::public.owner_type)) AS club_horses_count_week,
            count(DISTINCT event_participants_detail.horse_id) FILTER (WHERE (event_participants_detail.horse_ownership_type = 'other'::public.owner_type)) AS other_horses_count_week
           FROM event_participants_detail
          GROUP BY event_participants_detail.event_type, event_participants_detail.week_start
        ), event_counts_month AS (
         SELECT event_participants_detail.event_type,
            count(DISTINCT event_participants_detail.planning_slot_id) AS events_count_month,
            count(DISTINCT event_participants_detail.rider_id) AS riders_count_month,
            count(DISTINCT event_participants_detail.horse_id) AS horses_count_month,
            count(DISTINCT event_participants_detail.horse_id) FILTER (WHERE (event_participants_detail.horse_ownership_type = 'private_owner'::public.owner_type)) AS private_owner_horses_count_month,
            count(DISTINCT event_participants_detail.horse_id) FILTER (WHERE (event_participants_detail.horse_ownership_type = 'laury'::public.owner_type)) AS laury_horses_count_month,
            count(DISTINCT event_participants_detail.horse_id) FILTER (WHERE (event_participants_detail.horse_ownership_type = 'club'::public.owner_type)) AS club_horses_count_month,
            count(DISTINCT event_participants_detail.horse_id) FILTER (WHERE (event_participants_detail.horse_ownership_type = 'other'::public.owner_type)) AS other_horses_count_month
           FROM event_participants_detail
          GROUP BY event_participants_detail.event_type
        )
 SELECT ec.event_type,
    ec.week_start,
    ec.events_count_week,
    ec.riders_count_week,
    ec.horses_count_week,
    ec.private_owner_horses_count_week,
    ec.laury_horses_count_week,
    ec.club_horses_count_week,
    ec.other_horses_count_week,
    ecm.events_count_month,
    ecm.riders_count_month,
    ecm.horses_count_month,
    ecm.private_owner_horses_count_month,
    ecm.laury_horses_count_month,
    ecm.club_horses_count_month,
    ecm.other_horses_count_month
   FROM (event_counts ec
     LEFT JOIN event_counts_month ecm ON ((ecm.event_type = ec.event_type)))
  ORDER BY ec.event_type, ec.week_start;


ALTER VIEW public.event_details_live OWNER TO postgres;

--
-- Name: event_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.event_participants ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.event_participants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: horses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.horses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.horses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.packages (
    id integer NOT NULL,
    services_per_week integer NOT NULL,
    private_lessons_per_week integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    rider_id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT packages_group_lessons_per_week_check CHECK ((private_lessons_per_week >= 0)),
    CONSTRAINT packages_services_per_week_check CHECK ((services_per_week >= 0))
);


ALTER TABLE public.packages OWNER TO postgres;

--
-- Name: COLUMN packages.deleted_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.packages.deleted_at IS 'Soft delete timestamp';


--
-- Name: packages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.packages ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.packages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: planning_slots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.planning_slots ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.planning_slots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: recurrence_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurrence_participants (
    id integer NOT NULL,
    recurrence_id integer NOT NULL,
    rider_id integer NOT NULL,
    horse_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.recurrence_participants OWNER TO postgres;

--
-- Name: recurrence_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.recurrence_participants ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.recurrence_participants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: recurrences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurrences (
    id integer NOT NULL,
    frequency public.recurrence_frequency NOT NULL,
    "interval" integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    week_days jsonb,
    CONSTRAINT recurrences_interval_check CHECK (("interval" > 0))
);


ALTER TABLE public.recurrences OWNER TO postgres;

--
-- Name: TABLE recurrences; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.recurrences IS 'Recurrence rules for events (time-based, without fixed dates)';


--
-- Name: recurrences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.recurrences ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.recurrences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: rider_horse_pairings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rider_horse_pairings (
    id integer NOT NULL,
    rider_id integer NOT NULL,
    horse_id integer NOT NULL,
    pairing_start_date date,
    pairing_end_date date,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    link_type public.rider_horse_link_type NOT NULL,
    loan_days_per_week integer,
    loan_days jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT chk_loan_days_only_for_loan CHECK ((((link_type = 'loan'::public.rider_horse_link_type) AND (loan_days_per_week IS NOT NULL)) OR ((link_type = 'own'::public.rider_horse_link_type) AND (loan_days_per_week IS NULL)))),
    CONSTRAINT chk_loan_days_range CHECK (((loan_days_per_week IS NULL) OR ((loan_days_per_week >= 1) AND (loan_days_per_week <= 7))))
);


ALTER TABLE public.rider_horse_pairings OWNER TO postgres;

--
-- Name: rider_horse_pairings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rider_horse_pairings ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.rider_horse_pairings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: rider_monthly_billing_frozen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rider_monthly_billing_frozen (
    rider_id integer NOT NULL,
    rider_name character varying,
    month_start date NOT NULL,
    services_per_week integer,
    private_lessons_per_week integer,
    services_consumed numeric,
    private_lessons_consumed numeric,
    competition_extras numeric,
    special_extras numeric,
    extra_services numeric,
    extra_private_lessons numeric
);


ALTER TABLE public.rider_monthly_billing_frozen OWNER TO postgres;

--
-- Name: rider_monthly_billing_live; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.rider_monthly_billing_live AS
 WITH billing_months AS (
         SELECT (date_trunc('month'::text, d.d))::date AS month_start,
            ((date_trunc('month'::text, d.d) + '1 mon -1 days'::interval))::date AS month_end
           FROM generate_series(GREATEST(('2025-09-01'::date)::timestamp with time zone, (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) - '3 mons'::interval)), (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval), '1 mon'::interval) d(d)
        ), packages_with_bounds AS (
         SELECT p_1.id,
            p_1.rider_id,
            p_1.services_per_week,
            p_1.private_lessons_per_week,
            (p_1.created_at)::date AS start_date,
            COALESCE((p_1.deleted_at)::date, '9999-12-31'::date) AS end_date
           FROM public.packages p_1
          WHERE (p_1.created_at >= '2025-09-01'::date)
        ), package_overlap AS (
         SELECT bm.month_start,
            bm.month_end,
            p_1.rider_id,
            p_1.services_per_week,
            p_1.private_lessons_per_week,
            p_1.start_date,
            GREATEST(((LEAST(p_1.end_date, bm.month_end) - GREATEST(p_1.start_date, bm.month_start)) + 1), 0) AS overlap_days
           FROM (billing_months bm
             JOIN packages_with_bounds p_1 ON (((p_1.start_date <= bm.month_end) AND (p_1.end_date >= bm.month_start))))
        ), package_of_month AS (
         SELECT DISTINCT ON (package_overlap.rider_id, package_overlap.month_start) package_overlap.rider_id,
            package_overlap.month_start,
            package_overlap.services_per_week,
            package_overlap.private_lessons_per_week
           FROM package_overlap
          WHERE (package_overlap.overlap_days > 0)
          ORDER BY package_overlap.rider_id, package_overlap.month_start, package_overlap.overlap_days DESC, package_overlap.start_date DESC
        ), valid_participants AS (
         SELECT ep.rider_id,
            (date_trunc('month'::text, (ps.slot_date)::timestamp with time zone))::date AS month_start,
            (date_trunc('week'::text, (ps.slot_date)::timestamp with time zone))::date AS week_start,
            e.event_type
           FROM ((public.event_participants ep
             JOIN public.planning_slots ps ON ((ps.id = ep.planning_slot_id)))
             JOIN public.events e ON ((e.id = ps.event_id)))
          WHERE ((ps.slot_date >= '2025-09-01'::date) AND (ps.slot_date <= CURRENT_DATE) AND (ep.is_cancelled = false) AND (ps.deleted_at IS NULL) AND (ps.slot_status <> 'cancelled'::public.slot_status) AND (e.deleted_at IS NULL))
        ), weekly_consumption AS (
         SELECT valid_participants.rider_id,
            valid_participants.month_start,
            valid_participants.week_start,
            count(*) FILTER (WHERE (valid_participants.event_type = ANY (ARRAY['service'::public.event_type, 'grouped_lesson'::public.event_type]))) AS services_consumed,
            count(*) FILTER (WHERE (valid_participants.event_type = 'private_lesson'::public.event_type)) AS private_lessons_consumed,
            count(*) FILTER (WHERE (valid_participants.event_type = 'competition'::public.event_type)) AS competition_extras,
            count(*) FILTER (WHERE (valid_participants.event_type = 'special'::public.event_type)) AS special_extras
           FROM valid_participants
          GROUP BY valid_participants.rider_id, valid_participants.month_start, valid_participants.week_start
        ), monthly_aggregation AS (
         SELECT weekly_consumption.rider_id,
            weekly_consumption.month_start,
            sum(weekly_consumption.services_consumed) AS services_consumed,
            sum(weekly_consumption.private_lessons_consumed) AS private_lessons_consumed,
            sum(weekly_consumption.competition_extras) AS competition_extras,
            sum(weekly_consumption.special_extras) AS special_extras
           FROM weekly_consumption
          GROUP BY weekly_consumption.rider_id, weekly_consumption.month_start
        )
 SELECT r.id AS rider_id,
    r.name AS rider_name,
    m.month_start,
    p.services_per_week,
    p.private_lessons_per_week,
    COALESCE(a.services_consumed, (0)::numeric) AS services_consumed,
    COALESCE(a.private_lessons_consumed, (0)::numeric) AS private_lessons_consumed,
    COALESCE(a.competition_extras, (0)::numeric) AS competition_extras,
    COALESCE(a.special_extras, (0)::numeric) AS special_extras,
        CASE
            WHEN (p.rider_id IS NULL) THEN COALESCE(a.services_consumed, (0)::numeric)
            ELSE GREATEST((a.services_consumed - ((p.services_per_week * 4))::numeric), (0)::numeric)
        END AS extra_services,
        CASE
            WHEN (p.rider_id IS NULL) THEN COALESCE(a.private_lessons_consumed, (0)::numeric)
            ELSE GREATEST((a.private_lessons_consumed - ((p.private_lessons_per_week * 4))::numeric), (0)::numeric)
        END AS extra_private_lessons
   FROM (((billing_months m
     JOIN public.riders r ON ((r.deleted_at IS NULL)))
     LEFT JOIN package_of_month p ON (((p.rider_id = r.id) AND (p.month_start = m.month_start))))
     LEFT JOIN monthly_aggregation a ON (((a.rider_id = r.id) AND (a.month_start = m.month_start))))
  ORDER BY r.name, m.month_start;


ALTER VIEW public.rider_monthly_billing_live OWNER TO postgres;

--
-- Name: rider_monthly_billing; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.rider_monthly_billing AS
 SELECT rider_monthly_billing_frozen.rider_id,
    rider_monthly_billing_frozen.rider_name,
    rider_monthly_billing_frozen.month_start,
    rider_monthly_billing_frozen.services_per_week,
    rider_monthly_billing_frozen.private_lessons_per_week,
    rider_monthly_billing_frozen.services_consumed,
    rider_monthly_billing_frozen.private_lessons_consumed,
    rider_monthly_billing_frozen.competition_extras,
    rider_monthly_billing_frozen.special_extras,
    rider_monthly_billing_frozen.extra_services,
    rider_monthly_billing_frozen.extra_private_lessons
   FROM public.rider_monthly_billing_frozen
UNION ALL
 SELECT rider_monthly_billing_live.rider_id,
    rider_monthly_billing_live.rider_name,
    rider_monthly_billing_live.month_start,
    rider_monthly_billing_live.services_per_week,
    rider_monthly_billing_live.private_lessons_per_week,
    rider_monthly_billing_live.services_consumed,
    rider_monthly_billing_live.private_lessons_consumed,
    rider_monthly_billing_live.competition_extras,
    rider_monthly_billing_live.special_extras,
    rider_monthly_billing_live.extra_services,
    rider_monthly_billing_live.extra_private_lessons
   FROM public.rider_monthly_billing_live
  WHERE (NOT (rider_monthly_billing_live.month_start IN ( SELECT DISTINCT rider_monthly_billing_frozen.month_start
           FROM public.rider_monthly_billing_frozen)));


ALTER VIEW public.rider_monthly_billing OWNER TO postgres;

--
-- Name: rider_usage_live; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.rider_usage_live AS
 WITH month_context AS (
         SELECT (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))::date AS month_start,
            ((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval))::date AS month_end
        ), packages_with_bounds AS (
         SELECT p_1.id,
            p_1.rider_id,
            p_1.services_per_week,
            p_1.private_lessons_per_week,
            (p_1.created_at)::date AS start_date,
            COALESCE((p_1.deleted_at)::date, '9999-12-31'::date) AS end_date
           FROM public.packages p_1
        ), package_overlap AS (
         SELECT p_1.rider_id,
            p_1.services_per_week,
            p_1.private_lessons_per_week,
            p_1.start_date,
            GREATEST(((LEAST(p_1.end_date, m.month_end) - GREATEST(p_1.start_date, m.month_start)) + 1), 0) AS overlap_days
           FROM (packages_with_bounds p_1
             JOIN month_context m ON (true))
        ), package_of_month AS (
         SELECT DISTINCT ON (package_overlap.rider_id) package_overlap.rider_id,
            package_overlap.services_per_week,
            package_overlap.private_lessons_per_week
           FROM package_overlap
          WHERE (package_overlap.overlap_days > 0)
          ORDER BY package_overlap.rider_id, package_overlap.overlap_days DESC, package_overlap.start_date DESC
        ), weeks AS (
         SELECT (d.d)::date AS week_start
           FROM generate_series(date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone), (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval), '1 day'::interval) d(d)
          WHERE (EXTRACT(isodow FROM d.d) = (1)::numeric)
        ), valid_participants AS (
         SELECT ep.rider_id,
            (date_trunc('week'::text, (ps.slot_date)::timestamp with time zone))::date AS week_start,
            e.event_type
           FROM ((public.event_participants ep
             JOIN public.planning_slots ps ON ((ps.id = ep.planning_slot_id)))
             JOIN public.events e ON ((e.id = ps.event_id)))
          WHERE ((ep.is_cancelled = false) AND (ps.deleted_at IS NULL) AND (ps.slot_status <> 'cancelled'::public.slot_status) AND (e.deleted_at IS NULL) AND (ps.slot_date >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone)) AND (ps.slot_date <= (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval)))
        ), weekly_consumption AS (
         SELECT valid_participants.rider_id,
            valid_participants.week_start,
            count(*) FILTER (WHERE (valid_participants.event_type = ANY (ARRAY['service'::public.event_type, 'grouped_lesson'::public.event_type]))) AS services_consumed,
            count(*) FILTER (WHERE (valid_participants.event_type = 'private_lesson'::public.event_type)) AS private_lessons_consumed,
            count(*) FILTER (WHERE (valid_participants.event_type = 'competition'::public.event_type)) AS competition_extras,
            count(*) FILTER (WHERE (valid_participants.event_type = 'special'::public.event_type)) AS special_extras
           FROM valid_participants
          GROUP BY valid_participants.rider_id, valid_participants.week_start
        )
 SELECT r.id AS rider_id,
    r.name AS rider_name,
    w.week_start,
    p.services_per_week,
    p.private_lessons_per_week,
    COALESCE(c.services_consumed, (0)::bigint) AS services_consumed,
    COALESCE(c.private_lessons_consumed, (0)::bigint) AS private_lessons_consumed,
    COALESCE(c.competition_extras, (0)::bigint) AS competition_extras,
    COALESCE(c.special_extras, (0)::bigint) AS special_extras,
        CASE
            WHEN (p.rider_id IS NULL) THEN (0)::bigint
            ELSE GREATEST((p.services_per_week - COALESCE(c.services_consumed, (0)::bigint)), (0)::bigint)
        END AS remaining_services,
        CASE
            WHEN (p.rider_id IS NULL) THEN COALESCE(c.services_consumed, (0)::bigint)
            ELSE GREATEST((COALESCE(c.services_consumed, (0)::bigint) - p.services_per_week), (0)::bigint)
        END AS extra_services
   FROM (((public.riders r
     JOIN weeks w ON (true))
     LEFT JOIN package_of_month p ON ((p.rider_id = r.id)))
     LEFT JOIN weekly_consumption c ON (((c.rider_id = r.id) AND (c.week_start = w.week_start))))
  WHERE (r.deleted_at IS NULL)
  ORDER BY r.name, w.week_start;


ALTER VIEW public.rider_usage_live OWNER TO postgres;

--
-- Name: rider_usage_weekly; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.rider_usage_weekly AS
 WITH month_context AS (
         SELECT (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))::date AS month_start,
            ((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval))::date AS month_end
        ), packages_with_bounds AS (
         SELECT p_1.id,
            p_1.rider_id,
            p_1.services_per_week,
            p_1.private_lessons_per_week,
            (p_1.created_at)::date AS start_date,
            COALESCE((p_1.deleted_at)::date, '9999-12-31'::date) AS end_date
           FROM public.packages p_1
        ), package_overlap AS (
         SELECT p_1.rider_id,
            p_1.services_per_week,
            p_1.private_lessons_per_week,
            p_1.start_date,
            GREATEST(((LEAST(p_1.end_date, m.month_end) - GREATEST(p_1.start_date, m.month_start)) + 1), 0) AS overlap_days
           FROM (packages_with_bounds p_1
             CROSS JOIN month_context m)
        ), package_of_month AS (
         SELECT DISTINCT ON (package_overlap.rider_id) package_overlap.rider_id,
            package_overlap.services_per_week,
            package_overlap.private_lessons_per_week
           FROM package_overlap
          WHERE (package_overlap.overlap_days > 0)
          ORDER BY package_overlap.rider_id, package_overlap.overlap_days DESC, package_overlap.start_date DESC
        ), weeks AS (
         SELECT (d.d)::date AS week_start
           FROM generate_series(date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone), (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval), '1 day'::interval) d(d)
          WHERE (EXTRACT(isodow FROM d.d) = (1)::numeric)
        ), valid_participants AS (
         SELECT ep.rider_id,
            (date_trunc('week'::text, (ps.slot_date)::timestamp with time zone))::date AS week_start,
            e.event_type
           FROM ((public.event_participants ep
             JOIN public.planning_slots ps ON ((ps.id = ep.planning_slot_id)))
             JOIN public.events e ON ((e.id = ps.event_id)))
          WHERE ((ep.is_cancelled = false) AND (ps.deleted_at IS NULL) AND (ps.slot_status <> 'cancelled'::public.slot_status) AND (e.deleted_at IS NULL) AND (ps.slot_date >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone)) AND (ps.slot_date <= (date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon -1 days'::interval)))
        ), weekly_consumption AS (
         SELECT vp.rider_id,
            vp.week_start,
            count(*) FILTER (WHERE ((vp.event_type)::text = ANY (ARRAY['service'::text, 'grouped_lesson'::text]))) AS services_consumed,
            count(*) FILTER (WHERE ((vp.event_type)::text = 'private_lesson'::text)) AS private_lessons_consumed,
            count(*) FILTER (WHERE ((vp.event_type)::text = 'competition'::text)) AS competition_extras,
            count(*) FILTER (WHERE ((vp.event_type)::text = 'special'::text)) AS special_extras
           FROM valid_participants vp
          GROUP BY vp.rider_id, vp.week_start
        )
 SELECT r.id AS rider_id,
    r.name AS rider_name,
    w.week_start,
    p.services_per_week,
    p.private_lessons_per_week,
    COALESCE(c.services_consumed, (0)::bigint) AS services_consumed,
    COALESCE(c.private_lessons_consumed, (0)::bigint) AS private_lessons_consumed,
    COALESCE(c.competition_extras, (0)::bigint) AS competition_extras,
    COALESCE(c.special_extras, (0)::bigint) AS special_extras,
        CASE
            WHEN (p.rider_id IS NULL) THEN (0)::bigint
            ELSE GREATEST((p.services_per_week - COALESCE(c.services_consumed, (0)::bigint)), (0)::bigint)
        END AS remaining_services,
        CASE
            WHEN (p.rider_id IS NULL) THEN COALESCE(c.services_consumed, (0)::bigint)
            ELSE GREATEST((COALESCE(c.services_consumed, (0)::bigint) - p.services_per_week), (0)::bigint)
        END AS extra_services
   FROM (((public.riders r
     CROSS JOIN weeks w)
     LEFT JOIN package_of_month p ON ((p.rider_id = r.id)))
     LEFT JOIN weekly_consumption c ON (((c.rider_id = r.id) AND (c.week_start = w.week_start))))
  WHERE (r.deleted_at IS NULL)
  ORDER BY r.name, w.week_start;


ALTER VIEW public.rider_usage_weekly OWNER TO postgres;

--
-- Name: riders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.riders ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.riders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



--
-- Name: event_participants event_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_participants
    ADD CONSTRAINT event_participants_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: horses horses_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horses
    ADD CONSTRAINT horses_id_key UNIQUE (id);


--
-- Name: horses horses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horses
    ADD CONSTRAINT horses_name_key UNIQUE (name);


--
-- Name: horses horses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horses
    ADD CONSTRAINT horses_pkey PRIMARY KEY (id);


--
-- Name: packages packages_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_id_key UNIQUE (id);


--
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- Name: planning_slots planning_slots_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_slots
    ADD CONSTRAINT planning_slots_id_key UNIQUE (id);


--
-- Name: planning_slots planning_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_slots
    ADD CONSTRAINT planning_slots_pkey PRIMARY KEY (id);


--
-- Name: recurrence_participants recurrence_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurrence_participants
    ADD CONSTRAINT recurrence_participants_pkey PRIMARY KEY (id);


--
-- Name: recurrences recurrences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurrences
    ADD CONSTRAINT recurrences_pkey PRIMARY KEY (id);


--
-- Name: rider_horse_pairings rider_horse_pairings_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rider_horse_pairings
    ADD CONSTRAINT rider_horse_pairings_id_key UNIQUE (id);


--
-- Name: rider_horse_pairings rider_horse_pairings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rider_horse_pairings
    ADD CONSTRAINT rider_horse_pairings_pkey PRIMARY KEY (id);


--
-- Name: rider_monthly_billing_frozen rider_monthly_billing_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rider_monthly_billing_frozen
    ADD CONSTRAINT rider_monthly_billing_pk PRIMARY KEY (rider_id, month_start);


--
-- Name: riders riders_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riders
    ADD CONSTRAINT riders_email_key UNIQUE (email);


--
-- Name: riders riders_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riders
    ADD CONSTRAINT riders_id_key UNIQUE (id);


--
-- Name: riders riders_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riders
    ADD CONSTRAINT riders_phone_key UNIQUE (phone);


--
-- Name: riders riders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riders
    ADD CONSTRAINT riders_pkey PRIMARY KEY (id);


--
-- Name: rider_horse_pairings unique_rider_horse_period; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rider_horse_pairings
    ADD CONSTRAINT unique_rider_horse_period UNIQUE (rider_id, horse_id, pairing_start_date);


--
-- Name: idx_event_participants_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_participants_active ON public.event_participants USING btree (planning_slot_id) WHERE (is_cancelled = false);


--
-- Name: idx_event_participants_horse_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_participants_horse_id ON public.event_participants USING btree (horse_id);


--
-- Name: idx_event_participants_rider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_participants_rider ON public.event_participants USING btree (rider_id, planning_slot_id);


--
-- Name: idx_event_participants_rider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_participants_rider_id ON public.event_participants USING btree (rider_id);


--
-- Name: idx_event_participants_slot; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_participants_slot ON public.event_participants USING btree (planning_slot_id);


--
-- Name: idx_events_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_type ON public.events USING btree (id, event_type);


--
-- Name: idx_packages_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_packages_dates ON public.packages USING btree (rider_id, created_at, deleted_at);


--
-- Name: idx_planning_slots_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_planning_slots_date ON public.planning_slots USING btree (slot_date) WHERE (deleted_at IS NULL);


--
-- Name: idx_rhp_loan_days_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rhp_loan_days_gin ON public.rider_horse_pairings USING gin (loan_days);


--
-- Name: idx_rider_horse_pairings_horse_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rider_horse_pairings_horse_id ON public.rider_horse_pairings USING btree (horse_id);


--
-- Name: idx_rider_horse_pairings_rider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rider_horse_pairings_rider_id ON public.rider_horse_pairings USING btree (rider_id);


--
-- Name: idx_riders_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_riders_active ON public.riders USING btree (id) WHERE (deleted_at IS NULL);


--
-- Name: unique_active_package_per_rider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_active_package_per_rider ON public.packages USING btree (rider_id) WHERE ((is_active = true) AND (deleted_at IS NULL));


--
-- Name: INDEX unique_active_package_per_rider; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON INDEX public.unique_active_package_per_rider IS 'Ensures a rider can have only one active, non-deleted package at a time';


--
-- Name: unique_recurrence_participant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_recurrence_participant ON public.recurrence_participants USING btree (recurrence_id, rider_id);


--
-- Name: event_participants fk_event_participants_horse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_participants
    ADD CONSTRAINT fk_event_participants_horse FOREIGN KEY (horse_id) REFERENCES public.horses(id);


--
-- Name: event_participants fk_event_participants_rider; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_participants
    ADD CONSTRAINT fk_event_participants_rider FOREIGN KEY (rider_id) REFERENCES public.riders(id);


--
-- Name: event_participants fk_event_participants_slot; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_participants
    ADD CONSTRAINT fk_event_participants_slot FOREIGN KEY (planning_slot_id) REFERENCES public.planning_slots(id) ON DELETE CASCADE;


--
-- Name: packages fk_packages_rider; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT fk_packages_rider FOREIGN KEY (rider_id) REFERENCES public.riders(id) ON DELETE CASCADE;


--
-- Name: planning_slots planning_slots_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_slots
    ADD CONSTRAINT planning_slots_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recurrence_participants recurrence_participants_horse_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurrence_participants
    ADD CONSTRAINT recurrence_participants_horse_fkey FOREIGN KEY (horse_id) REFERENCES public.horses(id) ON DELETE SET NULL;


--
-- Name: recurrence_participants recurrence_participants_recurrence_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurrence_participants
    ADD CONSTRAINT recurrence_participants_recurrence_fkey FOREIGN KEY (recurrence_id) REFERENCES public.recurrences(id) ON DELETE CASCADE;


--
-- Name: recurrence_participants recurrence_participants_rider_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurrence_participants
    ADD CONSTRAINT recurrence_participants_rider_fkey FOREIGN KEY (rider_id) REFERENCES public.riders(id) ON DELETE CASCADE;


--
-- Name: rider_horse_pairings rider_horse_associations_horse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rider_horse_pairings
    ADD CONSTRAINT rider_horse_associations_horse_id_fkey FOREIGN KEY (horse_id) REFERENCES public.horses(id) ON DELETE CASCADE;


--
-- Name: rider_horse_pairings rider_horse_associations_rider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rider_horse_pairings
    ADD CONSTRAINT rider_horse_associations_rider_id_fkey FOREIGN KEY (rider_id) REFERENCES public.riders(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION calculate_end_time(start_time time without time zone, duration_minutes integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calculate_end_time(start_time time without time zone, duration_minutes integer) TO anon;
GRANT ALL ON FUNCTION public.calculate_end_time(start_time time without time zone, duration_minutes integer) TO authenticated;
GRANT ALL ON FUNCTION public.calculate_end_time(start_time time without time zone, duration_minutes integer) TO service_role;


--
-- Name: FUNCTION freeze_last_billing_month(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.freeze_last_billing_month() TO anon;
GRANT ALL ON FUNCTION public.freeze_last_billing_month() TO authenticated;
GRANT ALL ON FUNCTION public.freeze_last_billing_month() TO service_role;


--
-- Name: FUNCTION get_or_create_horse(horse_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_or_create_horse(horse_name text) TO anon;
GRANT ALL ON FUNCTION public.get_or_create_horse(horse_name text) TO authenticated;
GRANT ALL ON FUNCTION public.get_or_create_horse(horse_name text) TO service_role;


--
-- Name: FUNCTION get_or_create_rider(rider_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_or_create_rider(rider_name text) TO anon;
GRANT ALL ON FUNCTION public.get_or_create_rider(rider_name text) TO authenticated;
GRANT ALL ON FUNCTION public.get_or_create_rider(rider_name text) TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: TABLE event_participants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.event_participants TO anon;
GRANT ALL ON TABLE public.event_participants TO authenticated;
GRANT ALL ON TABLE public.event_participants TO service_role;


--
-- Name: TABLE events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.events TO anon;
GRANT ALL ON TABLE public.events TO authenticated;
GRANT ALL ON TABLE public.events TO service_role;


--
-- Name: TABLE horses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.horses TO anon;
GRANT ALL ON TABLE public.horses TO authenticated;
GRANT ALL ON TABLE public.horses TO service_role;


--
-- Name: TABLE planning_slots; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.planning_slots TO anon;
GRANT ALL ON TABLE public.planning_slots TO authenticated;
GRANT ALL ON TABLE public.planning_slots TO service_role;


--
-- Name: TABLE riders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.riders TO anon;
GRANT ALL ON TABLE public.riders TO authenticated;
GRANT ALL ON TABLE public.riders TO service_role;


--
-- Name: TABLE event_details_live; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.event_details_live TO anon;
GRANT ALL ON TABLE public.event_details_live TO authenticated;
GRANT ALL ON TABLE public.event_details_live TO service_role;


--
-- Name: SEQUENCE event_participants_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.event_participants_id_seq TO anon;
GRANT ALL ON SEQUENCE public.event_participants_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.event_participants_id_seq TO service_role;


--
-- Name: SEQUENCE events_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.events_id_seq TO anon;
GRANT ALL ON SEQUENCE public.events_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.events_id_seq TO service_role;


--
-- Name: SEQUENCE horses_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.horses_id_seq TO anon;
GRANT ALL ON SEQUENCE public.horses_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.horses_id_seq TO service_role;


--
-- Name: TABLE packages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.packages TO anon;
GRANT ALL ON TABLE public.packages TO authenticated;
GRANT ALL ON TABLE public.packages TO service_role;


--
-- Name: SEQUENCE packages_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.packages_id_seq TO anon;
GRANT ALL ON SEQUENCE public.packages_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.packages_id_seq TO service_role;


--
-- Name: SEQUENCE planning_slots_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.planning_slots_id_seq TO anon;
GRANT ALL ON SEQUENCE public.planning_slots_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.planning_slots_id_seq TO service_role;


--
-- Name: TABLE recurrence_participants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recurrence_participants TO anon;
GRANT ALL ON TABLE public.recurrence_participants TO authenticated;
GRANT ALL ON TABLE public.recurrence_participants TO service_role;


--
-- Name: SEQUENCE recurrence_participants_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.recurrence_participants_id_seq TO anon;
GRANT ALL ON SEQUENCE public.recurrence_participants_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.recurrence_participants_id_seq TO service_role;


--
-- Name: TABLE recurrences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recurrences TO anon;
GRANT ALL ON TABLE public.recurrences TO authenticated;
GRANT ALL ON TABLE public.recurrences TO service_role;


--
-- Name: SEQUENCE recurrences_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.recurrences_id_seq TO anon;
GRANT ALL ON SEQUENCE public.recurrences_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.recurrences_id_seq TO service_role;


--
-- Name: TABLE rider_horse_pairings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rider_horse_pairings TO anon;
GRANT ALL ON TABLE public.rider_horse_pairings TO authenticated;
GRANT ALL ON TABLE public.rider_horse_pairings TO service_role;


--
-- Name: SEQUENCE rider_horse_pairings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.rider_horse_pairings_id_seq TO anon;
GRANT ALL ON SEQUENCE public.rider_horse_pairings_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.rider_horse_pairings_id_seq TO service_role;


--
-- Name: TABLE rider_monthly_billing_frozen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rider_monthly_billing_frozen TO anon;
GRANT ALL ON TABLE public.rider_monthly_billing_frozen TO authenticated;
GRANT ALL ON TABLE public.rider_monthly_billing_frozen TO service_role;


--
-- Name: TABLE rider_monthly_billing_live; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rider_monthly_billing_live TO anon;
GRANT ALL ON TABLE public.rider_monthly_billing_live TO authenticated;
GRANT ALL ON TABLE public.rider_monthly_billing_live TO service_role;


--
-- Name: TABLE rider_monthly_billing; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rider_monthly_billing TO anon;
GRANT ALL ON TABLE public.rider_monthly_billing TO authenticated;
GRANT ALL ON TABLE public.rider_monthly_billing TO service_role;


--
-- Name: TABLE rider_usage_live; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rider_usage_live TO anon;
GRANT ALL ON TABLE public.rider_usage_live TO authenticated;
GRANT ALL ON TABLE public.rider_usage_live TO service_role;


--
-- Name: TABLE rider_usage_weekly; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rider_usage_weekly TO anon;
GRANT ALL ON TABLE public.rider_usage_weekly TO authenticated;
GRANT ALL ON TABLE public.rider_usage_weekly TO service_role;


--
-- Name: SEQUENCE riders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.riders_id_seq TO anon;
GRANT ALL ON SEQUENCE public.riders_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.riders_id_seq TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict tcOsqoaZ5wswPhNzMZyfRdmdrQslqzU2TMKutv0mneaKhy7bRn8elQwzcDkIJ5d

