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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abandoned_carts: {
        Row: {
          cart: Json
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          recovered_at: string | null
          recovered_order_id: string | null
          reminded_at: string | null
          reminder_count: number
          session_id: string | null
          subtotal_paise: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cart?: Json
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          recovered_at?: string | null
          recovered_order_id?: string | null
          reminded_at?: string | null
          reminder_count?: number
          session_id?: string | null
          subtotal_paise?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cart?: Json
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          recovered_at?: string | null
          recovered_order_id?: string | null
          reminded_at?: string | null
          reminder_count?: number
          session_id?: string | null
          subtotal_paise?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          full_name: string | null
          id: string
          is_default: boolean
          label: string | null
          line1: string
          line2: string | null
          phone: string | null
          pincode: string
          state: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          full_name?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          phone?: string | null
          pincode: string
          state: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          full_name?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          phone?: string | null
          pincode?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          data: Json
          id: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          data?: Json
          id?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          data?: Json
          id?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip: string | null
          metadata: Json
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip?: string | null
          metadata?: Json
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip?: string | null
          metadata?: Json
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          body_markdown: string | null
          category_id: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body_markdown?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body_markdown?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          discount_paise: number
          id: string
          order_id: string | null
          user_id: string | null
        }
        Insert: {
          coupon_id: string
          created_at?: string
          discount_paise: number
          id?: string
          order_id?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_id?: string
          created_at?: string
          discount_paise?: number
          id?: string
          order_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_discount_paise: number | null
          min_order_paise: number
          per_user_limit: number | null
          starts_at: string | null
          updated_at: string
          usage_count: number
          usage_limit: number | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_discount_paise?: number | null
          min_order_paise?: number
          per_user_limit?: number | null
          starts_at?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_discount_paise?: number | null
          min_order_paise?: number
          per_user_limit?: number | null
          starts_at?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          admin_notes: string | null
          city: string | null
          company: string | null
          created_at: string
          email: string | null
          form_type: string
          id: string
          message: string | null
          meta: Json | null
          name: string | null
          phone: string | null
          product_interest: string | null
          quantity: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          form_type: string
          id?: string
          message?: string | null
          meta?: Json | null
          name?: string | null
          phone?: string | null
          product_interest?: string | null
          quantity?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          form_type?: string
          id?: string
          message?: string | null
          meta?: Json | null
          name?: string | null
          phone?: string | null
          product_interest?: string | null
          quantity?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          active: boolean
          align: string | null
          created_at: string
          cta_href: string
          cta_label: string | null
          eyebrow: string | null
          id: string
          image_key: string | null
          image_url: string | null
          page: string
          sort_order: number
          subtitle: string | null
          title: string
          title_accent: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          align?: string | null
          created_at?: string
          cta_href?: string
          cta_label?: string | null
          eyebrow?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          page?: string
          sort_order?: number
          subtitle?: string | null
          title: string
          title_accent?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          align?: string | null
          created_at?: string
          cta_href?: string
          cta_label?: string | null
          eyebrow?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          page?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          title_accent?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      homepage_videos: {
        Row: {
          badge: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_featured: boolean
          placement: string
          link_url: string | null
          product_slug: string | null
          status: string
          subtitle: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          placement?: string
          link_url?: string | null
          product_slug?: string | null
          status?: string
          subtitle?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          placement?: string
          link_url?: string | null
          product_slug?: string | null
          status?: string
          subtitle?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          id: string
          section_key: string
          enabled: boolean
          sort_order: number
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_key: string
          enabled?: boolean
          sort_order?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_key?: string
          enabled?: boolean
          sort_order?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcement_items: {
        Row: {
          id: string
          text: string
          icon: string | null
          link: string | null
          open_in_new_tab: boolean
          enabled: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          text: string
          icon?: string | null
          link?: string | null
          open_in_new_tab?: boolean
          enabled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          text?: string
          icon?: string | null
          link?: string | null
          open_in_new_tab?: boolean
          enabled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_category_selection: {
        Row: {
          id: string
          category_slug: string
          enabled: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_slug: string
          enabled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_slug?: string
          enabled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_featured_products: {
        Row: {
          id: string
          product_slug: string
          enabled: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_slug: string
          enabled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_slug?: string
          enabled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_trust_items: {
        Row: {
          id: string
          title: string
          description: string | null
          icon: string | null
          enabled: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          icon?: string | null
          enabled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          icon?: string | null
          enabled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_history: {
        Row: {
          actor_id: string | null
          change: number
          created_at: string
          id: string
          product_id: string
          reason: string
          reference_id: string | null
        }
        Insert: {
          actor_id?: string | null
          change: number
          created_at?: string
          id?: string
          product_id: string
          reason: string
          reference_id?: string | null
        }
        Update: {
          actor_id?: string | null
          change?: number
          created_at?: string
          id?: string
          product_id?: string
          reason?: string
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_accounts: {
        Row: {
          lifetime_points: number
          points_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          lifetime_points?: number
          points_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          lifetime_points?: number
          points_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_ledger: {
        Row: {
          created_at: string
          delta: number
          id: string
          metadata: Json
          order_id: string | null
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delta: number
          id?: string
          metadata?: Json
          order_id?: string | null
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          delta?: number
          id?: string
          metadata?: Json
          order_id?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          bucket: string
          created_at: string
          filename: string
          height: number | null
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bucket: string
          created_at?: string
          filename: string
          height?: number | null
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bucket?: string
          created_at?: string
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirm_token: string | null
          confirmed: boolean
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
          source: string | null
          tags: string[]
          unsubscribe_token: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          confirm_token?: string | null
          confirmed?: boolean
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
          source?: string | null
          tags?: string[]
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          confirm_token?: string | null
          confirmed?: boolean
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          tags?: string[]
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          metadata: Json
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          link?: string | null
          metadata?: Json
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          metadata?: Json
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          coupon_code: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          delivered_at: string | null
          discount_paise: number
          email: string | null
          estimated_delivery: string | null
          full_name: string | null
          gift_note: string | null
          id: string
          items: Json
          notes: string | null
          order_number: string | null
          payment_method: string
          phone: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          refund_amount_paise: number | null
          refunded_at: string | null
          shipping: Json | null
          shipping_carrier: string | null
          shipping_paise: number
          status: string
          subtotal_paise: number
          tax_paise: number
          timeline: Json
          total_paise: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          coupon_code?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          delivered_at?: string | null
          discount_paise?: number
          email?: string | null
          estimated_delivery?: string | null
          full_name?: string | null
          gift_note?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string | null
          payment_method?: string
          phone?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          refund_amount_paise?: number | null
          refunded_at?: string | null
          shipping?: Json | null
          shipping_carrier?: string | null
          shipping_paise?: number
          status?: string
          subtotal_paise?: number
          tax_paise?: number
          timeline?: Json
          total_paise?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          coupon_code?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          delivered_at?: string | null
          discount_paise?: number
          email?: string | null
          estimated_delivery?: string | null
          full_name?: string | null
          gift_note?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string | null
          payment_method?: string
          phone?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          refund_amount_paise?: number | null
          refunded_at?: string | null
          shipping?: Json | null
          shipping_carrier?: string | null
          shipping_paise?: number
          status?: string
          subtotal_paise?: number
          tax_paise?: number
          timeline?: Json
          total_paise?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          barcode: string | null
          benefits: Json
          brand: string | null
          canonical_url: string | null
          category: string | null
          cost_price_paise: number | null
          created_at: string
          description: string | null
          dimensions: Json
          flora: string | null
          gst_percent: number | null
          hsn_code: string | null
          id: string
          image_key: string | null
          image_url: string | null
          images: Json
          in_stock: boolean
          ingredients: string | null
          is_bestseller: boolean
          is_featured: boolean
          is_new_arrival: boolean
          low_stock_limit: number
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          mrp: number | null
          name: string
          price: number
          price_max: number | null
          published: boolean
          rating: number
          reviews_count: number
          seo_description: string | null
          seo_title: string | null
          sizes: Json
          sku: string | null
          slug: string
          sort_order: number
          show_on_homepage: boolean | null
          status: string
          stock_quantity: number
          tagline: string | null
          updated_at: string
          usage_instructions: string | null
          video_url: string | null
          warnings: string | null
          weight_g: number | null
        }
        Insert: {
          badge?: string | null
          barcode?: string | null
          benefits?: Json
          brand?: string | null
          canonical_url?: string | null
          category?: string | null
          cost_price_paise?: number | null
          created_at?: string
          description?: string | null
          dimensions?: Json
          flora?: string | null
          gst_percent?: number | null
          hsn_code?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          images?: Json
          in_stock?: boolean
          ingredients?: string | null
          is_bestseller?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          low_stock_limit?: number
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          mrp?: number | null
          name: string
          price?: number
          price_max?: number | null
          published?: boolean
          rating?: number
          reviews_count?: number
          seo_description?: string | null
          seo_title?: string | null
          sizes?: Json
          sku?: string | null
          slug: string
          sort_order?: number
          show_on_homepage?: boolean | null
          status?: string
          stock_quantity?: number
          tagline?: string | null
          updated_at?: string
          usage_instructions?: string | null
          video_url?: string | null
          warnings?: string | null
          weight_g?: number | null
        }
        Update: {
          badge?: string | null
          barcode?: string | null
          benefits?: Json
          brand?: string | null
          canonical_url?: string | null
          category?: string | null
          cost_price_paise?: number | null
          created_at?: string
          description?: string | null
          dimensions?: Json
          flora?: string | null
          gst_percent?: number | null
          hsn_code?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          images?: Json
          in_stock?: boolean
          ingredients?: string | null
          is_bestseller?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          low_stock_limit?: number
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          mrp?: number | null
          name?: string
          price?: number
          price_max?: number | null
          published?: boolean
          rating?: number
          reviews_count?: number
          seo_description?: string | null
          seo_title?: string | null
          sizes?: Json
          sku?: string | null
          slug?: string
          sort_order?: number
          show_on_homepage?: boolean | null
          status?: string
          stock_quantity?: number
          tagline?: string | null
          updated_at?: string
          usage_instructions?: string | null
          video_url?: string | null
          warnings?: string | null
          weight_g?: number | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          barcode: string | null
          cost_price: number | null
          created_at: string
          id: string
          is_active: boolean
          is_default: boolean
          label: string
          low_stock_threshold: number
          mrp: number | null
          price: number
          product_id: string
          sku: string | null
          sort_order: number
          stock_quantity: number
          updated_at: string
          weight_g: number | null
        }
        Insert: {
          barcode?: string | null
          cost_price?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          label: string
          low_stock_threshold?: number
          mrp?: number | null
          price?: number
          product_id: string
          sku?: string | null
          sort_order?: number
          stock_quantity?: number
          updated_at?: string
          weight_g?: number | null
        }
        Update: {
          barcode?: string | null
          cost_price?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          label?: string
          low_stock_threshold?: number
          mrp?: number | null
          price?: number
          product_id?: string
          sku?: string | null
          sort_order?: number
          stock_quantity?: number
          updated_at?: string
          weight_g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          admin_notes: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          newsletter_opt_in: boolean
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          newsletter_opt_in?: boolean
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          newsletter_opt_in?: boolean
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          topics: string[]
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          topics?: string[]
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          topics?: string[]
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      redirects: {
        Row: {
          active: boolean
          code: number
          created_at: string
          from_path: string
          hits: number
          id: string
          note: string | null
          to_path: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          code?: number
          created_at?: string
          from_path: string
          hits?: number
          id?: string
          note?: string | null
          to_path: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: number
          created_at?: string
          from_path?: string
          hits?: number
          id?: string
          note?: string | null
          to_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          first_order_id: string | null
          id: string
          referred_email: string | null
          referred_user_id: string | null
          referrer_id: string
          reward_points: number | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          first_order_id?: string | null
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id: string
          reward_points?: number | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          first_order_id?: string | null
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id?: string
          reward_points?: number | null
          status?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_reply: string | null
          author_name: string | null
          body: string | null
          created_at: string
          helpful_count: number
          id: string
          is_featured: boolean
          media: Json
          product_slug: string
          rating: number
          status: string
          title: string | null
          updated_at: string
          user_id: string
          verified_purchase: boolean
        }
        Insert: {
          admin_reply?: string | null
          author_name?: string | null
          body?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          is_featured?: boolean
          media?: Json
          product_slug: string
          rating: number
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
          verified_purchase?: boolean
        }
        Update: {
          admin_reply?: string | null
          author_name?: string | null
          body?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          is_featured?: boolean
          media?: Json
          product_slug?: string
          rating?: number
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
          verified_purchase?: boolean
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          permission_key: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          permission_key: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          permission_key?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["key"]
          },
        ]
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      who_we_supply_services: {
        Row: {
          cta_message: string
          cta_text: string
          detail_title: string
          full_description: string
          icon_name: string
          id: string
          image_key: string | null
          image_url: string | null
          is_active: boolean
          key_points: string[]
          short_description: string
          sort_order: number
          subtitle: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          cta_message: string
          cta_text: string
          detail_title: string
          full_description: string
          icon_name?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          is_active?: boolean
          key_points?: string[]
          short_description: string
          sort_order?: number
          subtitle: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          cta_message?: string
          cta_text?: string
          detail_title?: string
          full_description?: string
          icon_name?: string
          id?: string
          image_key?: string | null
          image_url?: string | null
          is_active?: boolean
          key_points?: string[]
          short_description?: string
          sort_order?: number
          subtitle?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_dashboard_stats: { Args: never; Returns: Json }
      claim_admin_if_none: { Args: never; Returns: boolean }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: { _permission_key: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      log_audit: {
        Args: {
          _action: string
          _entity_id?: string
          _entity_type?: string
          _metadata?: Json
        }
        Returns: undefined
      }
      recent_public_orders: {
        Args: { _limit?: number }
        Returns: {
          city: string
          created_at: string
          first_name: string
          product_name: string
        }[]
      }
      track_order: {
        Args: { _email: string; _order_number: string }
        Returns: {
          created_at: string
          delivered_at: string
          estimated_delivery: string
          items: Json
          order_number: string
          shipping: Json
          shipping_carrier: string
          status: string
          timeline: Json
          total_paise: number
          tracking_number: string
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "super_admin"
        | "manager"
        | "editor"
        | "customer"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: [
        "admin",
        "moderator",
        "user",
        "super_admin",
        "manager",
        "editor",
        "customer",
      ],
    },
  },
} as const
