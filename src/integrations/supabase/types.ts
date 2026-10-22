export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      listing_images: {
        Row: {
          id: string
          listing_id: string
          sort_order: number
          url: string
        }
        Insert: {
          id?: string
          listing_id: string
          sort_order?: number
          url: string
        }
        Update: {
          id?: string
          listing_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_private: {
        Row: {
          listing_id: string
          notes: string | null
          url: string | null
        }
        Insert: {
          listing_id: string
          notes?: string | null
          url?: string | null
        }
        Update: {
          listing_id?: string
          notes?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_private_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          age_months: number
          asking_price: number
          buy_now_price: number | null
          category_id: string | null
          country: string | null
          cover_image: string | null
          created_at: string
          description: string
          id: string
          included: string[]
          is_featured: boolean
          is_verified: boolean
          monetization: string[]
          monthly_profit: number
          monthly_revenue: number
          monthly_traffic: number
          nda_required: boolean
          rejection_reason: string | null
          revenue_history: Json
          seller_country: string | null
          seller_id: string | null
          seller_name: string | null
          seller_rating: number | null
          slug: string
          status: Database["public"]["Enums"]["listing_status"]
          tagline: string | null
          tech_stack: string[]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          age_months?: number
          asking_price?: number
          buy_now_price?: number | null
          category_id?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          included?: string[]
          is_featured?: boolean
          is_verified?: boolean
          monetization?: string[]
          monthly_profit?: number
          monthly_revenue?: number
          monthly_traffic?: number
          nda_required?: boolean
          rejection_reason?: string | null
          revenue_history?: Json
          seller_country?: string | null
          seller_id?: string | null
          seller_name?: string | null
          seller_rating?: number | null
          slug: string
          status?: Database["public"]["Enums"]["listing_status"]
          tagline?: string | null
          tech_stack?: string[]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          age_months?: number
          asking_price?: number
          buy_now_price?: number | null
          category_id?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          included?: string[]
          is_featured?: boolean
          is_verified?: boolean
          monetization?: string[]
          monthly_profit?: number
          monthly_revenue?: number
          monthly_traffic?: number
          nda_required?: boolean
          rejection_reason?: string | null
          revenue_history?: Json
          seller_country?: string | null
          seller_id?: string | null
          seller_name?: string | null
          seller_rating?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["listing_status"]
          tagline?: string | null
          tech_stack?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          avatar_url: string | null
          binance_pay_id: string | null
          bio: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          is_verified_seller: boolean
          updated_at: string
          usdt_wallet: string | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          binance_pay_id?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_verified_seller?: boolean
          updated_at?: string
          usdt_wallet?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          binance_pay_id?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_verified_seller?: boolean
          updated_at?: string
          usdt_wallet?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          created_at: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          is_verified_seller: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_verified_seller?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_verified_seller?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_listing_view: { Args: { _id: string }; Returns: undefined }
    }
    Enums: {
      account_type: "buyer" | "seller" | "both"
      app_role: "admin" | "moderator" | "user"
      listing_status:
        | "draft"
        | "pending_review"
        | "approved"
        | "rejected"
        | "under_offer"
        | "sold"
        | "withdrawn"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["buyer", "seller", "both"],
      app_role: ["admin", "moderator", "user"],
      listing_status: [
        "draft",
        "pending_review",
        "approved",
        "rejected",
        "under_offer",
        "sold",
        "withdrawn",
        "expired",
      ],
    },
  },
} as const
