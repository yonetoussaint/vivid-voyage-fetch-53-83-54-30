export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      game_rooms: {
        Row: {
          board: Json
          code: string
          created_at: string
          current_player: string
          id: string
          last_move: Json | null
          player1_id: string | null
          player2_id: string | null
          status: string
          time_left_o: number
          time_left_x: number
          winner: string | null
        }
        Insert: {
          board: Json
          code: string
          created_at?: string
          current_player?: string
          id?: string
          last_move?: Json | null
          player1_id?: string | null
          player2_id?: string | null
          status?: string
          time_left_o?: number
          time_left_x?: number
          winner?: string | null
        }
        Update: {
          board?: Json
          code?: string
          created_at?: string
          current_player?: string
          id?: string
          last_move?: Json | null
          player1_id?: string | null
          player2_id?: string | null
          status?: string
          time_left_o?: number
          time_left_x?: number
          winner?: string | null
        }
        Relationships: []
      }
      hero_banners: {
        Row: {
          alt: string
          created_at: string
          duration: number | null
          id: string
          image: string
          position: number
          updated_at: string
        }
        Insert: {
          alt: string
          created_at?: string
          duration?: number | null
          id?: string
          image: string
          position?: number
          updated_at?: string
        }
        Update: {
          alt?: string
          created_at?: string
          duration?: number | null
          id?: string
          image?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          delivered_date: string | null
          id: string
          order_date: string | null
          payment_method: string | null
          payment_status: string | null
          product_id: string
          quantity: number
          seller_id: string | null
          shipped_date: string | null
          shipping_address: string | null
          status: string
          total_amount: number
          tracking_number: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          delivered_date?: string | null
          id: string
          order_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          product_id: string
          quantity?: number
          seller_id?: string | null
          shipped_date?: string | null
          shipping_address?: string | null
          status?: string
          total_amount: number
          tracking_number?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          delivered_date?: string | null
          id?: string
          order_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          product_id?: string
          quantity?: number
          seller_id?: string | null
          shipped_date?: string | null
          shipping_address?: string | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_orders_seller"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_codes: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          otp_code: string
          purpose: string | null
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          otp_code: string
          purpose?: string | null
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          purpose?: string | null
          used?: boolean | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          product_id: string
          src: string
          updated_at: string
        }
        Insert: {
          alt: string
          created_at?: string
          id?: string
          product_id: string
          src: string
          updated_at?: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          product_id?: string
          src?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_templates: {
        Row: {
          created_at: string
          default_variant_names: Json | null
          icon: string | null
          id: string
          name: string
          sku_generator_config: Json | null
          template_id: string
          updated_at: string
          variant_fields: Json | null
        }
        Insert: {
          created_at?: string
          default_variant_names?: Json | null
          icon?: string | null
          id?: string
          name: string
          sku_generator_config?: Json | null
          template_id: string
          updated_at?: string
          variant_fields?: Json | null
        }
        Update: {
          created_at?: string
          default_variant_names?: Json | null
          icon?: string | null
          id?: string
          name?: string
          sku_generator_config?: Json | null
          template_id?: string
          updated_at?: string
          variant_fields?: Json | null
        }
        Relationships: []
      }
      product_videos: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          product_id: string | null
          title: string | null
          updated_at: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          product_id?: string | null
          title?: string | null
          updated_at?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          product_id?: string | null
          title?: string | null
          updated_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_videos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          bundle_deals: Json | null
          bundle_deals_enabled: boolean | null
          color_variants: Json | null
          created_at: string
          description: string
          discount_price: number | null
          flash_deal: boolean | null
          flash_start_time: string | null
          id: string
          inventory: number | null
          last_activity: string | null
          location: string | null
          model_3d_url: string | null
          name: string
          price: number
          product_type: string | null
          saves: number | null
          seller_id: string | null
          seller_trust_score: number | null
          sold_count: number
          specifications: Json | null
          status: string | null
          storage_variants: Json | null
          tags: string[] | null
          updated_at: string
          variant_names: Json | null
          variant_options: Json | null
          variant_templates: Json | null
          views: number | null
        }
        Insert: {
          bundle_deals?: Json | null
          bundle_deals_enabled?: boolean | null
          color_variants?: Json | null
          created_at?: string
          description: string
          discount_price?: number | null
          flash_deal?: boolean | null
          flash_start_time?: string | null
          id?: string
          inventory?: number | null
          last_activity?: string | null
          location?: string | null
          model_3d_url?: string | null
          name: string
          price: number
          product_type?: string | null
          saves?: number | null
          seller_id?: string | null
          seller_trust_score?: number | null
          sold_count?: number
          specifications?: Json | null
          status?: string | null
          storage_variants?: Json | null
          tags?: string[] | null
          updated_at?: string
          variant_names?: Json | null
          variant_options?: Json | null
          variant_templates?: Json | null
          views?: number | null
        }
        Update: {
          bundle_deals?: Json | null
          bundle_deals_enabled?: boolean | null
          color_variants?: Json | null
          created_at?: string
          description?: string
          discount_price?: number | null
          flash_deal?: boolean | null
          flash_start_time?: string | null
          id?: string
          inventory?: number | null
          last_activity?: string | null
          location?: string | null
          model_3d_url?: string | null
          name?: string
          price?: number
          product_type?: string | null
          saves?: number | null
          seller_id?: string | null
          seller_trust_score?: number | null
          sold_count?: number
          specifications?: Json | null
          status?: string | null
          storage_variants?: Json | null
          tags?: string[] | null
          updated_at?: string
          variant_names?: Json | null
          variant_options?: Json | null
          variant_templates?: Json | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_provider: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          google_access_token: string | null
          google_id: string | null
          id: string
          last_login: string | null
          password_hash: string | null
          phone: string | null
          profile_picture: string | null
          seller_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          auth_provider?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          google_access_token?: string | null
          google_id?: string | null
          id: string
          last_login?: string | null
          password_hash?: string | null
          phone?: string | null
          profile_picture?: string | null
          seller_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          auth_provider?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          google_access_token?: string | null
          google_id?: string | null
          id?: string
          last_login?: string | null
          password_hash?: string | null
          phone?: string | null
          profile_picture?: string | null
          seller_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_answers: {
        Row: {
          answer: string | null
          answer_date: string | null
          answered_by: string | null
          ask_date: string
          asked_by: string
          created_at: string
          helpful_count: number
          id: string
          product_id: string
          question: string
          question_likes: number
          updated_at: string
        }
        Insert: {
          answer?: string | null
          answer_date?: string | null
          answered_by?: string | null
          ask_date?: string
          asked_by: string
          created_at?: string
          helpful_count?: number
          id?: string
          product_id: string
          question: string
          question_likes?: number
          updated_at?: string
        }
        Update: {
          answer?: string | null
          answer_date?: string | null
          answered_by?: string | null
          ask_date?: string
          asked_by?: string
          created_at?: string
          helpful_count?: number
          id?: string
          product_id?: string
          question?: string
          question_likes?: number
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          helpful_count: number | null
          id: string
          product_id: string | null
          rating: number
          seller_id: string | null
          title: string | null
          updated_at: string | null
          user_name: string
          verified_purchase: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          product_id?: string | null
          rating: number
          seller_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_name: string
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          product_id?: string | null
          rating?: number
          seller_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_name?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_reviews_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          address: string | null
          category: string | null
          created_at: string
          description: string | null
          email: string | null
          followers_count: number
          id: string
          image_url: string | null
          name: string
          phone: string | null
          rating: number | null
          status: string
          total_sales: number
          trust_score: number
          updated_at: string
          verified: boolean
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          followers_count?: number
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          status?: string
          total_sales?: number
          trust_score?: number
          updated_at?: string
          verified?: boolean
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          followers_count?: number
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          status?: string
          total_sales?: number
          trust_score?: number
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created: string
          id: number
          item_name: string | null
          item_number: string | null
          item_price: number | null
          item_price_currency: string | null
          modified: string
          order_id: string
          paid_amount: number
          paid_amount_currency: string
          payment_source: string | null
          payment_source_card_brand: string | null
          payment_source_card_expiry: string | null
          payment_source_card_last_digits: string | null
          payment_source_card_name: string | null
          payment_source_card_type: string | null
          payment_status: string
          transaction_id: string
        }
        Insert: {
          created?: string
          id?: never
          item_name?: string | null
          item_number?: string | null
          item_price?: number | null
          item_price_currency?: string | null
          modified?: string
          order_id: string
          paid_amount: number
          paid_amount_currency: string
          payment_source?: string | null
          payment_source_card_brand?: string | null
          payment_source_card_expiry?: string | null
          payment_source_card_last_digits?: string | null
          payment_source_card_name?: string | null
          payment_source_card_type?: string | null
          payment_status: string
          transaction_id: string
        }
        Update: {
          created?: string
          id?: never
          item_name?: string | null
          item_number?: string | null
          item_price?: number | null
          item_price_currency?: string | null
          modified?: string
          order_id?: string
          paid_amount?: number
          paid_amount_currency?: string
          payment_source?: string | null
          payment_source_card_brand?: string | null
          payment_source_card_expiry?: string | null
          payment_source_card_last_digits?: string | null
          payment_source_card_name?: string | null
          payment_source_card_type?: string | null
          payment_status?: string
          transaction_id?: string
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          phone: string | null
          verified: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          phone?: string | null
          verified?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          phone?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          avatar_url: string | null
          created_at: string
          description: string | null
          duration: number
          id: string
          likes: number
          tags: string[] | null
          thumbnail_url: string
          title: string
          updated_at: string
          user_id: string | null
          username: string
          video_url: string
          views: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          likes?: number
          tags?: string[] | null
          thumbnail_url: string
          title: string
          updated_at?: string
          user_id?: string | null
          username: string
          video_url: string
          views?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          likes?: number
          tags?: string[] | null
          thumbnail_url?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          username?: string
          video_url?: string
          views?: number
        }
        Relationships: []
      }

      // NEW TABLES ADDED HERE:
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      cart: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          title: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          zip_code: string
          country: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          zip_code: string
          country?: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          zip_code?: string
          country?: string
          is_default?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      help_tickets: {
        Row: {
          id: string
          user_id: string
          subject: string
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          message?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          user_id: string
          shortcuts_order: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          shortcuts_order?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          shortcuts_order?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_select_flash_deals: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_product_sold_count: {
        Args: { product_id: string }
        Returns: number
      }
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_product_saves: {
        Args: { product_id: string }
        Returns: undefined
      }
      increment_product_views: {
        Args: { product_id: string }
        Returns: undefined
      }
      join_game_room: {
        Args: { p_room_id: string; p_user_id: string }
        Returns: {
          board: Json
          code: string
          created_at: string
          current_player: string
          id: string
          last_move: Json | null
          player1_id: string | null
          player2_id: string | null
          status: string
          time_left_o: number
          time_left_x: number
          winner: string | null
        }[]
      }
      update_product: {
        Args: {
          p_description?: string
          p_discount_price?: number
          p_id: string
          p_inventory?: number
          p_name?: string
          p_price?: number
        }
        Returns: {
          bundle_deals: Json | null
          bundle_deals_enabled: boolean | null
          color_variants: Json | null
          created_at: string
          description: string
          discount_price: number | null
          flash_deal: boolean | null
          flash_start_time: string | null
          id: string
          inventory: number | null
          last_activity: string | null
          location: string | null
          model_3d_url: string | null
          name: string
          price: number
          product_type: string | null
          saves: number | null
          seller_id: string | null
          seller_trust_score: number | null
          sold_count: number
          specifications: Json | null
          status: string | null
          storage_variants: Json | null
          tags: string[] | null
          updated_at: string
          variant_names: Json | null
          variant_options: Json | null
          variant_templates: Json | null
          views: number | null
        }[]
      }
    }
    Enums: {
      tournament_status: "in-progress" | "closed" | "completed" | "upcoming"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// KEEP THESE IMPORTANT TYPE HELPERS:
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Alternative type helpers (choose one set or the other):
type DefaultSchema = Database['public']

export type Tables2<
  TableName extends keyof DefaultSchema['Tables'],
> = DefaultSchema['Tables'][TableName]['Row']

export type InsertTables2<
  TableName extends keyof DefaultSchema['Tables'],
> = DefaultSchema['Tables'][TableName]['Insert']

export type UpdateTables2<
  TableName extends keyof DefaultSchema['Tables'],
> = DefaultSchema['Tables'][TableName]['Update']

export type Enums2<
  EnumName extends keyof DefaultSchema['Enums'],
> = DefaultSchema['Enums'][EnumName]