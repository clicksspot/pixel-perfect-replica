import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Listing = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string;
  status: string;
  asking_price: number;
  buy_now_price: number | null;
  monthly_revenue: number;
  monthly_profit: number;
  monthly_traffic: number;
  age_months: number;
  monetization: string[];
  tech_stack: string[];
  country: string | null;
  included: string[];
  revenue_history: number[];
  cover_image: string | null;
  is_featured: boolean;
  is_verified: boolean;
  view_count: number;
  seller_name: string | null;
  seller_country: string | null;
  seller_rating: number | null;
  created_at: string;
  category: { slug: string; name: string } | null;
};

export type Category = { id: string; slug: string; name: string; description: string | null; icon: string | null };

const LISTING_SELECT = "*, category:categories(slug,name)";

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

export const featuredQuery = () =>
  queryOptions({
    queryKey: ["listings", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(LISTING_SELECT)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as unknown as Listing[];
    },
  });

export type BrowseFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRevenue?: number;
  minProfit?: number;
  minTraffic?: number;
  minAge?: number;
  monetization?: string;
  tech?: string;
  country?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "revenue" | "profit";
  page?: number;
};

export const PAGE_SIZE = 9;

export const browseQuery = (f: BrowseFilters) =>
  queryOptions({
    queryKey: ["listings", "browse", f],
    queryFn: async () => {
      let q = supabase
        .from("listings")
        .select(f.category ? "*, category:categories!inner(slug,name)" : LISTING_SELECT, { count: "exact" });
      if (f.q) q = q.or(`title.ilike.%${f.q.replace(/[%,()]/g, "")}%,tagline.ilike.%${f.q.replace(/[%,()]/g, "")}%`);
      if (f.category) q = q.eq("category.slug", f.category);
      if (f.minPrice) q = q.gte("asking_price", f.minPrice);
      if (f.maxPrice) q = q.lte("asking_price", f.maxPrice);
      if (f.minRevenue) q = q.gte("monthly_revenue", f.minRevenue);
      if (f.minProfit) q = q.gte("monthly_profit", f.minProfit);
      if (f.minTraffic) q = q.gte("monthly_traffic", f.minTraffic);
      if (f.minAge) q = q.gte("age_months", f.minAge);
      if (f.monetization) q = q.contains("monetization", [f.monetization]);
      if (f.tech) q = q.contains("tech_stack", [f.tech]);
      if (f.country) q = q.eq("country", f.country);
      const sort = f.sort ?? "newest";
      if (sort === "price_asc") q = q.order("asking_price", { ascending: true });
      else if (sort === "price_desc") q = q.order("asking_price", { ascending: false });
      else if (sort === "revenue") q = q.order("monthly_revenue", { ascending: false });
      else if (sort === "profit") q = q.order("monthly_profit", { ascending: false });
      else q = q.order("created_at", { ascending: false });
      const page = f.page ?? 1;
      q = q.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      return { items: data as unknown as Listing[], total: count ?? 0 };
    },
  });

export const listingQuery = (slug: string) =>
  queryOptions({
    queryKey: ["listing", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select(LISTING_SELECT).eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data as unknown as Listing | null;
    },
  });

export const similarQuery = (categorySlug: string | undefined, excludeId: string) =>
  queryOptions({
    queryKey: ["listings", "similar", categorySlug, excludeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, category:categories!inner(slug,name)")
        .eq("category.slug", categorySlug ?? "")
        .neq("id", excludeId)
        .limit(3);
      if (error) throw error;
      return data as unknown as Listing[];
    },
  });

export const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
export const compact = (n: number) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
export const ageLabel = (m: number) => (m >= 12 ? `${Math.floor(m / 12)}y ${m % 12 ? `${m % 12}m` : ""}`.trim() : `${m}m`);
export const multiple = (l: Listing) => (l.monthly_profit > 0 ? (l.asking_price / (l.monthly_profit * 12)).toFixed(1) + "x" : "—");
