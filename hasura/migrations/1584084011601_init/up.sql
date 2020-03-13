CREATE TABLE public.products (
    id bigint NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price integer NOT NULL,
    quantity_available integer NOT NULL,
    supplier_id integer NOT NULL,
    unsplash_id text,
    unit text
);
CREATE FUNCTION public.image_url(product_row public.products, width integer, height integer) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT 'https://source.unsplash.com/' || product_row.unsplash_id || '/' || width || 'x' || height
$$;
CREATE TABLE public.line_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    name text NOT NULL,
    price integer NOT NULL
);
CREATE SEQUENCE public.line_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.line_item_id_seq OWNED BY public.line_items.id;
CREATE TABLE public.orders (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    delivery_address text NOT NULL,
    total integer
);
CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.order_id_seq OWNED BY public.orders.id;
CREATE SEQUENCE public.product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.product_id_seq OWNED BY public.products.id;
CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    address text,
    notification_method text,
    notification_email text,
    notification_url text
);
CREATE SEQUENCE public.supplier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.supplier_id_seq OWNED BY public.suppliers.id;
CREATE TABLE public.supplier_notification_method (
    value text NOT NULL
);
CREATE VIEW public.supplier_orders AS
SELECT
    NULL::integer AS id,
    NULL::text AS name,
    NULL::text AS email,
    NULL::timestamp with time zone AS created_at,
    NULL::text AS delivery_address,
    NULL::integer AS supplier_id,
    NULL::integer AS total;
ALTER TABLE ONLY public.line_items ALTER COLUMN id SET DEFAULT nextval('public.line_item_id_seq'::regclass);
ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);
ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);
ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.supplier_id_seq'::regclass);
ALTER TABLE ONLY public.line_items
    ADD CONSTRAINT line_item_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products
    ADD CONSTRAINT product_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.supplier_notification_method
    ADD CONSTRAINT supplier_notification_method_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT supplier_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT supplier_slug_key UNIQUE (slug);
CREATE OR REPLACE VIEW public.supplier_orders AS
 SELECT orders.id,
    orders.name,
    orders.email,
    orders.created_at,
    orders.delivery_address,
    suppliers.id AS supplier_id,
    orders.total
   FROM (((public.orders
     JOIN public.line_items i ON ((orders.id = i.order_id)))
     JOIN public.products p ON ((i.product_id = p.id)))
     JOIN public.suppliers ON ((p.supplier_id = suppliers.id)))
  GROUP BY orders.id, suppliers.id;
ALTER TABLE ONLY public.line_items
    ADD CONSTRAINT line_item_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.line_items
    ADD CONSTRAINT line_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.products
    ADD CONSTRAINT product_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_notification_method_fkey FOREIGN KEY (notification_method) REFERENCES public.supplier_notification_method(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
