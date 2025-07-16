--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2025-07-16 10:16:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16399)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16400)
-- Name: event_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_enrollments (
    id integer NOT NULL,
    id_event integer NOT NULL,
    id_user integer NOT NULL,
    description character varying,
    registration_date_time date NOT NULL,
    attended integer,
    observations character varying,
    rating integer
);


ALTER TABLE public.event_enrollments OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16405)
-- Name: event_enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_enrollments_id_seq OWNER TO postgres;

--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 216
-- Name: event_enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_enrollments_id_seq OWNED BY public.event_enrollments.id;


--
-- TOC entry 217 (class 1259 OID 16406)
-- Name: event_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_locations (
    id integer NOT NULL,
    id_location integer NOT NULL,
    name character varying NOT NULL,
    full_adress character varying NOT NULL,
    max_capacity character varying NOT NULL,
    latitude integer NOT NULL,
    longitude integer NOT NULL
);


ALTER TABLE public.event_locations OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16411)
-- Name: event_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_locations_id_seq OWNER TO postgres;

--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 218
-- Name: event_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_locations_id_seq OWNED BY public.event_locations.id;


--
-- TOC entry 219 (class 1259 OID 16412)
-- Name: event_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_tags (
    event_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.event_tags OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16415)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    id_event_location integer NOT NULL,
    start_date date NOT NULL,
    duration_in_minutes integer NOT NULL,
    price double precision NOT NULL,
    max_assistance integer NOT NULL,
    id_creator_user integer NOT NULL,
    enabled_for_enrollment boolean
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16420)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 221
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 222 (class 1259 OID 16421)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying NOT NULL,
    id_province integer NOT NULL,
    latitude integer NOT NULL,
    longitude integer NOT NULL
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16426)
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO postgres;

--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 223
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- TOC entry 224 (class 1259 OID 16427)
-- Name: participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participants (
    event_id integer NOT NULL,
    user_id integer NOT NULL,
    attended boolean NOT NULL,
    rating integer,
    description character varying
);


ALTER TABLE public.participants OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16432)
-- Name: provinces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinces (
    id integer NOT NULL,
    name character varying(100),
    full_name character varying(100),
    latitude integer,
    longitude integer,
    display_order integer
);


ALTER TABLE public.provinces OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16435)
-- Name: provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.provinces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provinces_id_seq OWNER TO postgres;

--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 226
-- Name: provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provinces_id_seq OWNED BY public.provinces.id;


--
-- TOC entry 227 (class 1259 OID 16436)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16441)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 228
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 229 (class 1259 OID 16442)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16445)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 230
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4672 (class 2604 OID 16446)
-- Name: event_enrollments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments ALTER COLUMN id SET DEFAULT nextval('public.event_enrollments_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 16447)
-- Name: event_locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations ALTER COLUMN id SET DEFAULT nextval('public.event_locations_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 16448)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 16449)
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- TOC entry 4676 (class 2604 OID 16450)
-- Name: provinces id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces ALTER COLUMN id SET DEFAULT nextval('public.provinces_id_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 16451)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 16452)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4846 (class 0 OID 16400)
-- Dependencies: 215
-- Data for Name: event_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4848 (class 0 OID 16406)
-- Dependencies: 217
-- Data for Name: event_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_locations VALUES (1, 3391, 'Club Atlético River Plate', 'Av. Pres. Figueroa Alcorta 7597', '84567', -35, -58);


--
-- TOC entry 4850 (class 0 OID 16412)
-- Dependencies: 219
-- Data for Name: event_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_tags VALUES (2, 1);
INSERT INTO public.event_tags VALUES (2, 2);


--
-- TOC entry 4851 (class 0 OID 16415)
-- Dependencies: 220
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events VALUES (2, 'Taylor Swift', 'Un alto show', 1, '2024-03-21', 210, 15500, 120000, 3, NULL);
INSERT INTO public.events VALUES (4, 'Torneo de Ajedrez Actualizado', 'Se agregan nuevas categorías.', 1, '2025-08-01', 150, 250, 40, 1, true);
INSERT INTO public.events VALUES (3, 'Torneo de Ajedrez Actualizado', 'Se agregan nuevas categorías.', 1, '2025-08-01', 150, 250, 40, 1, true);


--
-- TOC entry 4853 (class 0 OID 16421)
-- Dependencies: 222
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.locations VALUES (3391, 'Nuñez', 1, -35, -58);


--
-- TOC entry 4855 (class 0 OID 16427)
-- Dependencies: 224
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.participants VALUES (2, 3, false, NULL, NULL);
INSERT INTO public.participants VALUES (2, 1, true, 5, 'Alto Chow');


--
-- TOC entry 4856 (class 0 OID 16432)
-- Dependencies: 225
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.provinces VALUES (1, 'Ciudad Autónoma de Buenos Aires', 'Ciudad Autónoma de Buenos Aires', -35, -58, NULL);


--
-- TOC entry 4858 (class 0 OID 16436)
-- Dependencies: 227
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tags VALUES (1, 'Rock');
INSERT INTO public.tags VALUES (2, 'Pop');


--
-- TOC entry 4860 (class 0 OID 16442)
-- Dependencies: 229
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (3, 'Julian', 'Schiffer', 'Jschiffer', '321');
INSERT INTO public.users VALUES (1, 'Pablo', 'Ulman', 'Polshetta', '123');
INSERT INTO public.users VALUES (4, 'sol', 'izra', 'solizra', '$2b$10$RFgFwNIUWp/tlpXaVS2biezqODDUlpMz3lQaLAdWvwOhrGW60aGpa');


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 216
-- Name: event_enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_enrollments_id_seq', 3, true);


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 218
-- Name: event_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_locations_id_seq', 1, false);


--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 221
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 4, true);


--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 223
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 1, false);


--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 226
-- Name: provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provinces_id_seq', 1, false);


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 228
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 230
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4684 (class 2606 OID 16454)
-- Name: events id_event; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT id_event PRIMARY KEY (id);


--
-- TOC entry 4680 (class 2606 OID 16456)
-- Name: event_enrollments id_event_enrollment; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT id_event_enrollment PRIMARY KEY (id);


--
-- TOC entry 4682 (class 2606 OID 16458)
-- Name: event_locations id_event_locations; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT id_event_locations PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 16460)
-- Name: locations id_location; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT id_location PRIMARY KEY (id);


--
-- TOC entry 4688 (class 2606 OID 16462)
-- Name: provinces id_province; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT id_province PRIMARY KEY (id);


--
-- TOC entry 4690 (class 2606 OID 16464)
-- Name: tags id_tags; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT id_tags PRIMARY KEY (id);


--
-- TOC entry 4692 (class 2606 OID 16466)
-- Name: users id_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT id_user PRIMARY KEY (id);


--
-- TOC entry 4701 (class 2606 OID 16467)
-- Name: participants event_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT event_id FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4696 (class 2606 OID 16472)
-- Name: event_tags event_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_id FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4698 (class 2606 OID 16477)
-- Name: events id_creator_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT id_creator_user FOREIGN KEY (id_creator_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4693 (class 2606 OID 16482)
-- Name: event_enrollments id_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT id_event FOREIGN KEY (id_event) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4699 (class 2606 OID 16487)
-- Name: events id_event_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT id_event_location FOREIGN KEY (id_event_location) REFERENCES public.event_locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4695 (class 2606 OID 16492)
-- Name: event_locations id_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT id_location FOREIGN KEY (id_location) REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4700 (class 2606 OID 16497)
-- Name: locations id_province; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT id_province FOREIGN KEY (id_province) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4694 (class 2606 OID 16502)
-- Name: event_enrollments id_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT id_user FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4697 (class 2606 OID 16507)
-- Name: event_tags tag_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT tag_id FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4702 (class 2606 OID 16512)
-- Name: participants user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-07-16 10:16:34

--
-- PostgreSQL database dump complete
--

