export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity: {
        Row: {
          enable: boolean
          id: string
          restaurant_id: number | null
          text: string
          updated_at: string
        }
        Insert: {
          enable?: boolean
          id: string
          restaurant_id?: number | null
          text: string
          updated_at?: string
        }
        Update: {
          enable?: boolean
          id?: string
          restaurant_id?: number | null
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_dish: {
        Row: {
          activity_id: string
          dish_id: number
          enable: boolean
          restaurant_id: number
        }
        Insert: {
          activity_id: string
          dish_id: number
          enable?: boolean
          restaurant_id: number
        }
        Update: {
          activity_id?: string
          dish_id?: number
          enable?: boolean
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_dish_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_dish_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_dish_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      brand: {
        Row: {
          description: string | null
          id: number
          logo: string | null
          main_restaurant: number | null
          name: string | null
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: number
          logo?: string | null
          main_restaurant?: number | null
          name?: string | null
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: number
          logo?: string | null
          main_restaurant?: number | null
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_main_restaurant_fkey"
            columns: ["main_restaurant"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_business: {
        Row: {
          brand_id: number
          data: Json | null
          nif: string | null
        }
        Insert: {
          brand_id: number
          data?: Json | null
          nif?: string | null
        }
        Update: {
          brand_id?: number
          data?: Json | null
          nif?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_business_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: true
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      category: {
        Row: {
          enable: boolean
          id: number
          restaurant_id: number
          text: string
        }
        Insert: {
          enable?: boolean
          id?: number
          restaurant_id: number
          text: string
        }
        Update: {
          enable?: boolean
          id?: number
          restaurant_id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      category_multilingua: {
        Row: {
          category_id: number
          language_code: string
          text: string | null
        }
        Insert: {
          category_id: number
          language_code: string
          text?: string | null
        }
        Update: {
          category_id?: number
          language_code?: string
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_multilingua_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_multilingua_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
        ]
      }
      custom_dish: {
        Row: {
          descriptions: Json
          id: number
          options: Json
          restaurant_id: number
        }
        Insert: {
          descriptions?: Json
          id?: number
          options?: Json
          restaurant_id: number
        }
        Update: {
          descriptions?: Json
          id?: number
          options?: Json
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_custom_dish_restaurant"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_dish_group: {
        Row: {
          dish_id: number
          enable: boolean
          id: number
          max_quantity: number
          min_quantity: number
          print_text: string | null
          restaurant_id: number
          weight: number
        }
        Insert: {
          dish_id: number
          enable?: boolean
          id?: number
          max_quantity?: number
          min_quantity?: number
          print_text?: string | null
          restaurant_id: number
          weight?: number
        }
        Update: {
          dish_id?: number
          enable?: boolean
          id?: number
          max_quantity?: number
          min_quantity?: number
          print_text?: string | null
          restaurant_id?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_custom_dish_group_dish"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "custom_dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_custom_dish_group_restaurant"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_dish_group_name_multilingua: {
        Row: {
          group_id: number
          language_code: string
          restaurant_id: number
          text: string
        }
        Insert: {
          group_id: number
          language_code: string
          restaurant_id: number
          text: string
        }
        Update: {
          group_id?: number
          language_code?: string
          restaurant_id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_custom_dish_group_name_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "custom_dish_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_custom_dish_group_name_language"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "fk_custom_dish_group_name_restaurant"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_dish_item: {
        Row: {
          delivery_price: number
          enable: boolean
          group_id: number
          id: number
          image: string | null
          price: number
          print_text: string | null
          restaurant_id: number
          weight: number
        }
        Insert: {
          delivery_price?: number
          enable?: boolean
          group_id: number
          id?: number
          image?: string | null
          price?: number
          print_text?: string | null
          restaurant_id: number
          weight?: number
        }
        Update: {
          delivery_price?: number
          enable?: boolean
          group_id?: number
          id?: number
          image?: string | null
          price?: number
          print_text?: string | null
          restaurant_id?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_custom_dish_item_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "custom_dish_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_custom_dish_item_restaurant"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_dish_item_name_multilingua: {
        Row: {
          item_id: number
          language_code: string
          restaurant_id: number
          text: string
        }
        Insert: {
          item_id: number
          language_code: string
          restaurant_id: number
          text: string
        }
        Update: {
          item_id?: number
          language_code?: string
          restaurant_id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_custom_dish_item_name_item"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "custom_dish_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_custom_dish_item_name_language"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "fk_custom_dish_item_name_restaurant"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_order: {
        Row: {
          address: string
          contact_name: string
          contact_phone: string
          created_at: string
          deleted_at: string | null
          email: string
          id: number
          note: string | null
          payment_status: string
          postal_code: string
          record_no: number
          restaurant_id: number
          status: string
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          contact_name: string
          contact_phone: string
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: number
          note?: string | null
          payment_status?: string
          postal_code: string
          record_no: number
          restaurant_id: number
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: number
          note?: string | null
          payment_status?: string
          postal_code?: string
          record_no?: number
          restaurant_id?: number
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_order_payment_status_fkey"
            columns: ["payment_status"]
            isOneToOne: false
            referencedRelation: "delivery_order_payment_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "delivery_order_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_order_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "delivery_order_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "delivery_order_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_order_item: {
        Row: {
          delivery_order_id: number
          discount: number | null
          dish_id: number
          dish_sku: string
          id: number
          name: string | null
          parent_item_id: number | null
          price: number
          quantity: number
          restaurant_id: number
          updated_at: string
        }
        Insert: {
          delivery_order_id: number
          discount?: number | null
          dish_id: number
          dish_sku: string
          id?: number
          name?: string | null
          parent_item_id?: number | null
          price: number
          quantity?: number
          restaurant_id: number
          updated_at?: string
        }
        Update: {
          delivery_order_id?: number
          discount?: number | null
          dish_id?: number
          dish_sku?: string
          id?: number
          name?: string | null
          parent_item_id?: number | null
          price?: number
          quantity?: number
          restaurant_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_order_item_delivery_order_id_fkey"
            columns: ["delivery_order_id"]
            isOneToOne: false
            referencedRelation: "delivery_order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_order_item_parent_item_id_fkey"
            columns: ["parent_item_id"]
            isOneToOne: false
            referencedRelation: "delivery_order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_order_item_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_order_payment_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      delivery_order_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      delivery_platform: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      delivery_record: {
        Row: {
          created_at: string
          data: Json | null
          external_id: string | null
          id: number
          platform: string
          record_no: number
          restaurant_id: number
        }
        Insert: {
          created_at?: string
          data?: Json | null
          external_id?: string | null
          id?: number
          platform?: string
          record_no: number
          restaurant_id: number
        }
        Update: {
          created_at?: string
          data?: Json | null
          external_id?: string | null
          id?: number
          platform?: string
          record_no?: number
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "delivery_record_platform_fkey"
            columns: ["platform"]
            isOneToOne: false
            referencedRelation: "delivery_platform"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "delivery_record_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      dish: {
        Row: {
          category_id: number | null
          created_at: string
          custom_dish_id: number | null
          delivery_discount: number | null
          delivery_price: number
          discount: number | null
          id: number
          image: string | null
          likes: number
          linked_dish: number | null
          order_limit: number | null
          price: number
          print_text: string | null
          rates: number
          restaurant_id: number
          sdr_id: number | null
          sku: string
          status: string
          table_limit: number | null
          tax_rate: string
          updated_at: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          custom_dish_id?: number | null
          delivery_discount?: number | null
          delivery_price?: number
          discount?: number | null
          id?: number
          image?: string | null
          likes?: number
          linked_dish?: number | null
          order_limit?: number | null
          price?: number
          print_text?: string | null
          rates?: number
          restaurant_id: number
          sdr_id?: number | null
          sku: string
          status?: string
          table_limit?: number | null
          tax_rate?: string
          updated_at?: string
        }
        Update: {
          category_id?: number | null
          created_at?: string
          custom_dish_id?: number | null
          delivery_discount?: number | null
          delivery_price?: number
          discount?: number | null
          id?: number
          image?: string | null
          likes?: number
          linked_dish?: number | null
          order_limit?: number | null
          price?: number
          print_text?: string | null
          rates?: number
          restaurant_id?: number
          sdr_id?: number | null
          sku?: string
          status?: string
          table_limit?: number | null
          tax_rate?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_custom_dish_id_fkey"
            columns: ["custom_dish_id"]
            isOneToOne: false
            referencedRelation: "custom_dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_linked_dish_fkey"
            columns: ["linked_dish"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_sdr_id_fkey"
            columns: ["sdr_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "dish_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "dish_tax_rate_fk"
            columns: ["tax_rate"]
            isOneToOne: false
            referencedRelation: "pt_tax_rate"
            referencedColumns: ["code"]
          },
        ]
      }
      dish_description_multilingua: {
        Row: {
          dish_id: number
          language_code: string
          restaurant_id: number
          text: string | null
        }
        Insert: {
          dish_id: number
          language_code: string
          restaurant_id: number
          text?: string | null
        }
        Update: {
          dish_id?: number
          language_code?: string
          restaurant_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dish_description_multilingua_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_description_multilingua_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "dish_description_multilingua_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      dish_group: {
        Row: {
          enable: boolean
          id: number
          image: string | null
          restaurant_id: number
        }
        Insert: {
          enable?: boolean
          id?: number
          image?: string | null
          restaurant_id: number
        }
        Update: {
          enable?: boolean
          id?: number
          image?: string | null
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "dish_group_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      dish_group_sale_channel: {
        Row: {
          dish_group_id: number
          restaurant_id: number
          sale_channel: string
        }
        Insert: {
          dish_group_id: number
          restaurant_id: number
          sale_channel: string
        }
        Update: {
          dish_group_id?: number
          restaurant_id?: number
          sale_channel?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_group_sale_channel_dish_group_id_fkey"
            columns: ["dish_group_id"]
            isOneToOne: false
            referencedRelation: "dish_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_group_sale_channel_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_group_sale_channel_sale_channel_fkey"
            columns: ["sale_channel"]
            isOneToOne: false
            referencedRelation: "sale_channel"
            referencedColumns: ["code"]
          },
        ]
      }
      dish_name_multilingua: {
        Row: {
          dish_id: number
          language_code: string
          restaurant_id: number
          text: string | null
        }
        Insert: {
          dish_id: number
          language_code: string
          restaurant_id: number
          text?: string | null
        }
        Update: {
          dish_id?: number
          language_code?: string
          restaurant_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dish_name_multilingua_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_name_multilingua_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "dish_name_multilingua_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      dish_relation: {
        Row: {
          dish_id: number
          id: number
          other_dish_id: number
          relation_type: Database["public"]["Enums"]["dish_relation_type"]
          restaurant_id: number
        }
        Insert: {
          dish_id: number
          id?: number
          other_dish_id: number
          relation_type: Database["public"]["Enums"]["dish_relation_type"]
          restaurant_id: number
        }
        Update: {
          dish_id?: number
          id?: number
          other_dish_id?: number
          relation_type?: Database["public"]["Enums"]["dish_relation_type"]
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "dish_relation_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_relation_other_dish_id_fkey"
            columns: ["other_dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_relation_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      dish_sale_channel: {
        Row: {
          dish_id: number
          restaurant_id: number
          sale_channel: string
        }
        Insert: {
          dish_id: number
          restaurant_id: number
          sale_channel: string
        }
        Update: {
          dish_id?: number
          restaurant_id?: number
          sale_channel?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_sale_channel_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_sale_channel_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_sale_channel_sale_channel_fkey"
            columns: ["sale_channel"]
            isOneToOne: false
            referencedRelation: "sale_channel"
            referencedColumns: ["code"]
          },
        ]
      }
      dish_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      dish_tag: {
        Row: {
          dish_id: number
          enable: boolean
          restaurant_id: number
          tag_id: number
          tag_type: string
        }
        Insert: {
          dish_id: number
          enable?: boolean
          restaurant_id: number
          tag_id: number
          tag_type: string
        }
        Update: {
          dish_id?: number
          enable?: boolean
          restaurant_id?: number
          tag_id?: number
          tag_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_tag_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_tag_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_tag_tag_id_tag_type_fkey"
            columns: ["tag_id", "tag_type"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id", "type"]
          },
        ]
      }
      group_description_multilingua: {
        Row: {
          group_id: number
          language_code: string
          text: string | null
        }
        Insert: {
          group_id: number
          language_code: string
          text?: string | null
        }
        Update: {
          group_id?: number
          language_code?: string
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_description_multilingua_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dish_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_description_multilingua_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
        ]
      }
      group_name_multilingua: {
        Row: {
          group_id: number
          language_code: string
          restaurant_id: number
          text: string | null
        }
        Insert: {
          group_id: number
          language_code: string
          restaurant_id: number
          text?: string | null
        }
        Update: {
          group_id?: number
          language_code?: string
          restaurant_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_name_multilingua_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dish_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_name_multilingua_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "group_name_multilingua_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      holiday_data: {
        Row: {
          city: string | null
          country: string | null
          date: string
          id: number
          name: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          date: string
          id?: number
          name: string
        }
        Update: {
          city?: string | null
          country?: string | null
          date?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      information_card_type: {
        Row: {
          id: number
          text: string
        }
        Insert: {
          id?: number
          text: string
        }
        Update: {
          id?: number
          text?: string
        }
        Relationships: []
      }
      language: {
        Row: {
          code: string
          text: string | null
        }
        Insert: {
          code: string
          text?: string | null
        }
        Update: {
          code?: string
          text?: string | null
        }
        Relationships: []
      }
      message_code: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      notification_type: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      operation_log: {
        Row: {
          action: string
          created_at: string
          detail: Json | null
          error_message: string | null
          id: number
          restaurant_id: number | null
          source: string
          status: string
          summary: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          detail?: Json | null
          error_message?: string | null
          id?: number
          restaurant_id?: number | null
          source: string
          status?: string
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          detail?: Json | null
          error_message?: string | null
          id?: number
          restaurant_id?: number | null
          source?: string
          status?: string
          summary?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          note_description: string | null
          note_name: string | null
          record_no: number
          restaurant_id: number
          status: string
          table_id: number
          table_start_time: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          note_description?: string | null
          note_name?: string | null
          record_no: number
          restaurant_id: number
          status?: string
          table_id: number
          table_start_time: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          note_description?: string | null
          note_name?: string | null
          record_no?: number
          restaurant_id?: number
          status?: string
          table_id?: number
          table_start_time?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "order_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "order_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_table"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item: {
        Row: {
          detail: Json | null
          discount: number | null
          dish_id: number
          dish_sku: string
          id: number
          name: string | null
          note: string | null
          order_id: number
          parent_item_id: number | null
          price: number
          quantity: number
          restaurant_id: number
          status: string
          tax_rate: string | null
          updated_at: string
        }
        Insert: {
          detail?: Json | null
          discount?: number | null
          dish_id: number
          dish_sku: string
          id?: number
          name?: string | null
          note?: string | null
          order_id: number
          parent_item_id?: number | null
          price: number
          quantity?: number
          restaurant_id: number
          status?: string
          tax_rate?: string | null
          updated_at?: string
        }
        Update: {
          detail?: Json | null
          discount?: number | null
          dish_id?: number
          dish_sku?: string
          id?: number
          name?: string | null
          note?: string | null
          order_id?: number
          parent_item_id?: number | null
          price?: number
          quantity?: number
          restaurant_id?: number
          status?: string
          tax_rate?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_parent_item_fk"
            columns: ["parent_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "order_item_status"
            referencedColumns: ["code"]
          },
        ]
      }
      order_item_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      order_print_model: {
        Row: {
          id: number
          print_model_code: string
          text: string
        }
        Insert: {
          id?: number
          print_model_code: string
          text: string
        }
        Update: {
          id?: number
          print_model_code?: string
          text?: string
        }
        Relationships: []
      }
      order_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      payment_type: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      people_type: {
        Row: {
          id: number
          text: string
        }
        Insert: {
          id?: number
          text: string
        }
        Update: {
          id?: number
          text?: string
        }
        Relationships: []
      }
      printer: {
        Row: {
          divide: boolean
          dpi: number
          font: number
          id: number
          is_default_invoice: boolean
          order_print_model_id: number
          paper_width: number
          physical_printer_ip: string | null
          physical_printer_name: string | null
          print_tag: number[]
          print_takeaway: boolean
          printable_width_mm: number | null
          printer_driver_id: number | null
          restaurant_id: number
          status: string | null
          takeaway_print_model_id: number
          text: string
          updated_at: string
          use_ip: boolean
        }
        Insert: {
          divide?: boolean
          dpi?: number
          font?: number
          id?: number
          is_default_invoice?: boolean
          order_print_model_id?: number
          paper_width?: number
          physical_printer_ip?: string | null
          physical_printer_name?: string | null
          print_tag?: number[]
          print_takeaway?: boolean
          printable_width_mm?: number | null
          printer_driver_id?: number | null
          restaurant_id: number
          status?: string | null
          takeaway_print_model_id?: number
          text: string
          updated_at?: string
          use_ip?: boolean
        }
        Update: {
          divide?: boolean
          dpi?: number
          font?: number
          id?: number
          is_default_invoice?: boolean
          order_print_model_id?: number
          paper_width?: number
          physical_printer_ip?: string | null
          physical_printer_name?: string | null
          print_tag?: number[]
          print_takeaway?: boolean
          printable_width_mm?: number | null
          printer_driver_id?: number | null
          restaurant_id?: number
          status?: string | null
          takeaway_print_model_id?: number
          text?: string
          updated_at?: string
          use_ip?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "printer_order_print_model_id_fkey"
            columns: ["order_print_model_id"]
            isOneToOne: false
            referencedRelation: "order_print_model"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "printer_printer_driver_id_fkey"
            columns: ["printer_driver_id"]
            isOneToOne: false
            referencedRelation: "printer_driver"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "printer_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "printer_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "printer_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "printer_takeaway_print_model_id_fkey"
            columns: ["takeaway_print_model_id"]
            isOneToOne: false
            referencedRelation: "takeaway_print_model"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_driver: {
        Row: {
          driver_id: string
          id: number
          name: string | null
          restaurant_id: number
          status: string
          text: string | null
        }
        Insert: {
          driver_id: string
          id?: number
          name?: string | null
          restaurant_id: number
          status?: string
          text?: string | null
        }
        Update: {
          driver_id?: string
          id?: number
          name?: string | null
          restaurant_id?: number
          status?: string
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printer_driver_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "printer_driver_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "printer_driver_status"
            referencedColumns: ["code"]
          },
        ]
      }
      printer_driver_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      printer_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      pt_tax_rate: {
        Row: {
          code: string
          rate: number
          text: string
        }
        Insert: {
          code: string
          rate: number
          text: string
        }
        Update: {
          code?: string
          rate?: number
          text?: string
        }
        Relationships: []
      }
      reserver_order: {
        Row: {
          confirmation_token: string
          contact_name: string
          contact_phone: string
          created_at: string
          deleted_at: string | null
          email: string
          email_confirmed_at: string | null
          guest_count: number
          id: number
          note: string | null
          payment_status: string
          record_no: number
          reserved_at: string
          restaurant_id: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          confirmation_token?: string
          contact_name: string
          contact_phone: string
          created_at?: string
          deleted_at?: string | null
          email: string
          email_confirmed_at?: string | null
          guest_count: number
          id?: number
          note?: string | null
          payment_status?: string
          record_no: number
          reserved_at: string
          restaurant_id: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          confirmation_token?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          email_confirmed_at?: string | null
          guest_count?: number
          id?: number
          note?: string | null
          payment_status?: string
          record_no?: number
          reserved_at?: string
          restaurant_id?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reserver_order_payment_status_fkey"
            columns: ["payment_status"]
            isOneToOne: false
            referencedRelation: "reserver_order_payment_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "reserver_order_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reserver_order_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "reserver_order_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "reserver_order_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      reserver_order_payment_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      reserver_order_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      restaurant: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      restaurant_business_information: {
        Row: {
          brand_id: number | null
          enable: boolean
          nif: string | null
          parent_id: number | null
          restaurant_id: number
          updated_at: string
          weight_dinein: number
          weight_takeaway: number
        }
        Insert: {
          brand_id?: number | null
          enable?: boolean
          nif?: string | null
          parent_id?: number | null
          restaurant_id: number
          updated_at?: string
          weight_dinein?: number
          weight_takeaway?: number
        }
        Update: {
          brand_id?: number | null
          enable?: boolean
          nif?: string | null
          parent_id?: number | null
          restaurant_id?: number
          updated_at?: string
          weight_dinein?: number
          weight_takeaway?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_business_information_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_business_information_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_business_information_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_description_multilingua: {
        Row: {
          language_code: string
          restaurant_id: number
          text: string | null
        }
        Insert: {
          language_code: string
          restaurant_id: number
          text?: string | null
        }
        Update: {
          language_code?: string
          restaurant_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_description_multilingua_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "restaurant_description_multilingua_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_information: {
        Row: {
          brand_logo: string | null
          dining_mode: Database["public"]["Enums"]["dining_mode"]
          email: string | null
          is_holiday: boolean
          location_city: string | null
          location_country: string | null
          location_latitude: number | null
          location_longitude: number | null
          location_post_code: string | null
          location_region: string | null
          location_street: string | null
          logo: string | null
          name: string | null
          phone: string | null
          restaurant_id: number
          sub_name: string | null
          tag: string | null
          updated_at: string
        }
        Insert: {
          brand_logo?: string | null
          dining_mode?: Database["public"]["Enums"]["dining_mode"]
          email?: string | null
          is_holiday?: boolean
          location_city?: string | null
          location_country?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          location_post_code?: string | null
          location_region?: string | null
          location_street?: string | null
          logo?: string | null
          name?: string | null
          phone?: string | null
          restaurant_id: number
          sub_name?: string | null
          tag?: string | null
          updated_at?: string
        }
        Update: {
          brand_logo?: string | null
          dining_mode?: Database["public"]["Enums"]["dining_mode"]
          email?: string | null
          is_holiday?: boolean
          location_city?: string | null
          location_country?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          location_post_code?: string | null
          location_region?: string | null
          location_street?: string | null
          logo?: string | null
          name?: string | null
          phone?: string | null
          restaurant_id?: number
          sub_name?: string | null
          tag?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_information_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_language: {
        Row: {
          language_code: string
          restaurant_id: number
          weight: number
        }
        Insert: {
          language_code: string
          restaurant_id: number
          weight?: number
        }
        Update: {
          language_code?: string
          restaurant_id?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_language_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "restaurant_language_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_message: {
        Row: {
          count: number
          data: Json | null
          message: string
          message_code: string
          restaurant_id: number
        }
        Insert: {
          count?: number
          data?: Json | null
          message: string
          message_code: string
          restaurant_id: number
        }
        Update: {
          count?: number
          data?: Json | null
          message?: string
          message_code?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_message_message_code_fkey"
            columns: ["message_code"]
            isOneToOne: false
            referencedRelation: "message_code"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "restaurant_message_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_open_hour: {
        Row: {
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          end_time?: string
          restaurant_id?: number
          start_time?: string
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_open_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_people_price: {
        Row: {
          end_time: string
          people_type_id: number
          price: number
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          end_time: string
          people_type_id: number
          price?: number
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          end_time?: string
          people_type_id?: number
          price?: number
          restaurant_id?: number
          start_time?: string
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_people_price_people_type_id_fkey"
            columns: ["people_type_id"]
            isOneToOne: false
            referencedRelation: "people_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_people_price_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_permission: {
        Row: {
          code: string
        }
        Insert: {
          code: string
        }
        Update: {
          code?: string
        }
        Relationships: []
      }
      restaurant_permission_control: {
        Row: {
          restaurant_id: number
          restaurant_permission_code: string
        }
        Insert: {
          restaurant_id: number
          restaurant_permission_code: string
        }
        Update: {
          restaurant_id?: number
          restaurant_permission_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_permission_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_permission_control_restaurant_permission_code_fkey"
            columns: ["restaurant_permission_code"]
            isOneToOne: false
            referencedRelation: "restaurant_permission"
            referencedColumns: ["code"]
          },
        ]
      }
      restaurant_role: {
        Row: {
          id: number
          is_system: boolean
          parent_id: number | null
          restaurant_id: number
          role: string
        }
        Insert: {
          id?: number
          is_system?: boolean
          parent_id?: number | null
          restaurant_id: number
          role: string
        }
        Update: {
          id?: number
          is_system?: boolean
          parent_id?: number | null
          restaurant_id?: number
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_role_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "restaurant_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_role_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_role_permission: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      restaurant_role_permission_control: {
        Row: {
          restaurant_role_id: number
          restaurant_role_permission_code: string
        }
        Insert: {
          restaurant_role_id: number
          restaurant_role_permission_code: string
        }
        Update: {
          restaurant_role_id?: number
          restaurant_role_permission_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_role_permission_co_restaurant_role_permission_c_fkey"
            columns: ["restaurant_role_permission_code"]
            isOneToOne: false
            referencedRelation: "restaurant_role_permission"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "restaurant_role_permission_control_restaurant_role_id_fkey"
            columns: ["restaurant_role_id"]
            isOneToOne: false
            referencedRelation: "restaurant_role"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_social_media_url: {
        Row: {
          restaurant_id: number
          social_media_type_id: number
          url: string
        }
        Insert: {
          restaurant_id: number
          social_media_type_id: number
          url: string
        }
        Update: {
          restaurant_id?: number
          social_media_type_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_social_media_url_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_social_media_url_social_media_type_id_fkey"
            columns: ["social_media_type_id"]
            isOneToOne: false
            referencedRelation: "social_media_type"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_spacial_day: {
        Row: {
          day: number | null
          enable: boolean
          end_time: string | null
          id: number
          month: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day: number | null
          year: number | null
        }
        Insert: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day?: number | null
          year?: number | null
        }
        Update: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id?: number
          start_time?: string
          text?: string
          week_day?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_spacial_day_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_table: {
        Row: {
          created_at: string
          enable: boolean
          id: number
          restaurant_id: number
          start_time: number | null
          status: string
          table_name: string
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          enable?: boolean
          id?: number
          restaurant_id: number
          start_time?: number | null
          status?: string
          table_name: string
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          enable?: boolean
          id?: number
          restaurant_id?: number
          start_time?: number | null
          status?: string
          table_name?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_table_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_table_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "table_status"
            referencedColumns: ["code"]
          },
        ]
      }
      restaurant_table_people_count: {
        Row: {
          count: number
          people_type_id: number
          restaurant_id: number
          table_id: number
        }
        Insert: {
          count?: number
          people_type_id: number
          restaurant_id: number
          table_id: number
        }
        Update: {
          count?: number
          people_type_id?: number
          restaurant_id?: number
          table_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_table_people_count_people_type_id_fkey"
            columns: ["people_type_id"]
            isOneToOne: false
            referencedRelation: "people_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_table_people_count_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_table_people_count_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_table"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_table_state: {
        Row: {
          password: string | null
          password_update: string | null
          restaurant_id: number
          table_id: number
        }
        Insert: {
          password?: string | null
          password_update?: string | null
          restaurant_id: number
          table_id: number
        }
        Update: {
          password?: string | null
          password_update?: string | null
          restaurant_id?: number
          table_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_table_state_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: true
            referencedRelation: "restaurant_table"
            referencedColumns: ["id"]
          },
        ]
      }
      role: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      sale_channel: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      service_delivery: {
        Row: {
          created_at: string
          paid_on: string
          restaurant_id: number
        }
        Insert: {
          created_at?: string
          paid_on?: string
          restaurant_id: number
        }
        Update: {
          created_at?: string
          paid_on?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_delivery_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      service_delivery_business_hour: {
        Row: {
          exclude_date: string[]
          exclude_monthly_day: number[]
          exclude_week_day: number[]
          id: number
          restaurant_id: number
          time_interval: number
        }
        Insert: {
          exclude_date?: string[]
          exclude_monthly_day?: number[]
          exclude_week_day?: number[]
          id?: number
          restaurant_id: number
          time_interval?: number
        }
        Update: {
          exclude_date?: string[]
          exclude_monthly_day?: number[]
          exclude_week_day?: number[]
          id?: number
          restaurant_id?: number
          time_interval?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_delivery_business_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_delivery"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_delivery_control: {
        Row: {
          enable: boolean
          restaurant_id: number
        }
        Insert: {
          enable?: boolean
          restaurant_id: number
        }
        Update: {
          enable?: boolean
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_delivery_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_delivery"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_delivery_open_hour: {
        Row: {
          discount: number
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          discount?: number
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          discount?: number
          end_time?: string
          restaurant_id?: number
          start_time?: string
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "service_delivery_open_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_delivery"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_delivery_payment_type_control: {
        Row: {
          data: Json | null
          enable: boolean
          payment_type_code: string
          restaurant_id: number
        }
        Insert: {
          data?: Json | null
          enable?: boolean
          payment_type_code: string
          restaurant_id: number
        }
        Update: {
          data?: Json | null
          enable?: boolean
          payment_type_code?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_delivery_payment_type_control_payment_type_code_fkey"
            columns: ["payment_type_code"]
            isOneToOne: false
            referencedRelation: "payment_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "service_delivery_payment_type_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_delivery"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_delivery_spacial_day: {
        Row: {
          day: number | null
          enable: boolean
          end_time: string | null
          id: number
          month: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day: number | null
          year: number | null
        }
        Insert: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day?: number | null
          year?: number | null
        }
        Update: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id?: number
          start_time?: string
          text?: string
          week_day?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_delivery_spacial_day_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_delivery"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_order: {
        Row: {
          created_at: string
          paid_on: string
          restaurant_id: number
        }
        Insert: {
          created_at?: string
          paid_on?: string
          restaurant_id: number
        }
        Update: {
          created_at?: string
          paid_on?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_business_hour: {
        Row: {
          exclude_date: string[]
          exclude_monthly_day: number[]
          exclude_week_day: number[]
          id: number
          restaurant_id: number
          time_interval: number
        }
        Insert: {
          exclude_date?: string[]
          exclude_monthly_day?: number[]
          exclude_week_day?: number[]
          id?: number
          restaurant_id: number
          time_interval?: number
        }
        Update: {
          exclude_date?: string[]
          exclude_monthly_day?: number[]
          exclude_week_day?: number[]
          id?: number
          restaurant_id?: number
          time_interval?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_business_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_order"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_order_control: {
        Row: {
          ai_recommended: boolean
          auto_print_invoice: boolean
          auto_print_order: boolean
          business_hour_information_card: boolean
          check_ip: boolean
          checkout_printer_id: number | null
          client_cooling_time: number
          enable: boolean
          invoice_api_enabled: boolean
          price_information_card: boolean
          restaurant_id: number
          table_cooling_time: number
          table_order_use_password: boolean
          variety_shop_mode: boolean
          view_model_id: number
        }
        Insert: {
          ai_recommended?: boolean
          auto_print_invoice?: boolean
          auto_print_order?: boolean
          business_hour_information_card?: boolean
          check_ip?: boolean
          checkout_printer_id?: number | null
          client_cooling_time?: number
          enable?: boolean
          invoice_api_enabled?: boolean
          price_information_card?: boolean
          restaurant_id: number
          table_cooling_time?: number
          table_order_use_password?: boolean
          variety_shop_mode?: boolean
          view_model_id?: number
        }
        Update: {
          ai_recommended?: boolean
          auto_print_invoice?: boolean
          auto_print_order?: boolean
          business_hour_information_card?: boolean
          check_ip?: boolean
          checkout_printer_id?: number | null
          client_cooling_time?: number
          enable?: boolean
          invoice_api_enabled?: boolean
          price_information_card?: boolean
          restaurant_id?: number
          table_cooling_time?: number
          table_order_use_password?: boolean
          variety_shop_mode?: boolean
          view_model_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_order_control_checkout_printer"
            columns: ["checkout_printer_id"]
            isOneToOne: false
            referencedRelation: "printer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_order"
            referencedColumns: ["restaurant_id"]
          },
          {
            foreignKeyName: "service_order_control_view_model_id_fkey"
            columns: ["view_model_id"]
            isOneToOne: false
            referencedRelation: "view_model"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_information: {
        Row: {
          acknowledgement: string | null
          restaurant_id: number
        }
        Insert: {
          acknowledgement?: string | null
          restaurant_id: number
        }
        Update: {
          acknowledgement?: string | null
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_information_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_order"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_order_information_background: {
        Row: {
          id: number
          image_path: string
          restaurant_id: number
          screen_type: Database["public"]["Enums"]["screen_type"]
          weight: number
        }
        Insert: {
          id?: number
          image_path: string
          restaurant_id: number
          screen_type: Database["public"]["Enums"]["screen_type"]
          weight?: number
        }
        Update: {
          id?: number
          image_path?: string
          restaurant_id?: number
          screen_type?: Database["public"]["Enums"]["screen_type"]
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_information_background_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_order"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_order_information_card: {
        Row: {
          enable: boolean
          icon: string | null
          id: number
          information_card_type_id: number
          restaurant_id: number
          weight: number
        }
        Insert: {
          enable?: boolean
          icon?: string | null
          id?: number
          information_card_type_id: number
          restaurant_id: number
          weight?: number
        }
        Update: {
          enable?: boolean
          icon?: string | null
          id?: number
          information_card_type_id?: number
          restaurant_id?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_information_card_information_card_type_id_fkey"
            columns: ["information_card_type_id"]
            isOneToOne: false
            referencedRelation: "information_card_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_information_card_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_order"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_order_information_card_message_multilingua: {
        Row: {
          language_code: string
          service_order_information_card_id: number
          text: string | null
        }
        Insert: {
          language_code: string
          service_order_information_card_id: number
          text?: string | null
        }
        Update: {
          language_code?: string
          service_order_information_card_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_information_ca_service_order_information_ca_fkey1"
            columns: ["service_order_information_card_id"]
            isOneToOne: false
            referencedRelation: "service_order_information_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_information_card_message_multi_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
        ]
      }
      service_order_information_card_title_multilingua: {
        Row: {
          language_code: string
          service_order_information_card_id: number
          text: string | null
        }
        Insert: {
          language_code: string
          service_order_information_card_id: number
          text?: string | null
        }
        Update: {
          language_code?: string
          service_order_information_card_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_information_car_service_order_information_ca_fkey"
            columns: ["service_order_information_card_id"]
            isOneToOne: false
            referencedRelation: "service_order_information_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_information_card_title_multili_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
        ]
      }
      service_order_open_hour: {
        Row: {
          discount: number | null
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          discount?: number | null
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          discount?: number | null
          end_time?: string
          restaurant_id?: number
          start_time?: string
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "service_order_open_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_order"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_order_payment_type_control: {
        Row: {
          data: Json | null
          enable: boolean
          payment_type_code: string
          restaurant_id: number
        }
        Insert: {
          data?: Json | null
          enable?: boolean
          payment_type_code: string
          restaurant_id: number
        }
        Update: {
          data?: Json | null
          enable?: boolean
          payment_type_code?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_payment_type_control_payment_type_code_fkey"
            columns: ["payment_type_code"]
            isOneToOne: false
            referencedRelation: "payment_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "service_order_payment_type_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_order"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_order_record: {
        Row: {
          created_at: string
          data: Json | null
          date: string
          id: number
          record_no: number
          restaurant_id: number
        }
        Insert: {
          created_at?: string
          data?: Json | null
          date?: string
          id?: number
          record_no: number
          restaurant_id: number
        }
        Update: {
          created_at?: string
          data?: Json | null
          date?: string
          id?: number
          record_no?: number
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_record_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_spacial_day: {
        Row: {
          day: number | null
          enable: boolean
          end_time: string | null
          id: number
          month: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day: number | null
          year: number | null
        }
        Insert: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day?: number | null
          year?: number | null
        }
        Update: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id?: number
          start_time?: string
          text?: string
          week_day?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_spacial_day_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_order"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_record_counter: {
        Row: {
          current_no: number
          restaurant_id: number
          type: string
        }
        Insert: {
          current_no?: number
          restaurant_id: number
          type: string
        }
        Update: {
          current_no?: number
          restaurant_id?: number
          type?: string
        }
        Relationships: []
      }
      service_reserver: {
        Row: {
          created_at: string
          paid_on: string
          restaurant_id: number
        }
        Insert: {
          created_at?: string
          paid_on?: string
          restaurant_id: number
        }
        Update: {
          created_at?: string
          paid_on?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_reserver_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reserver_business_hour: {
        Row: {
          exclude_date: string[]
          exclude_monthly_day: number[]
          exclude_week_day: number[]
          id: number
          restaurant_id: number
          time_interval: number
        }
        Insert: {
          exclude_date?: string[]
          exclude_monthly_day?: number[]
          exclude_week_day?: number[]
          id?: number
          restaurant_id: number
          time_interval?: number
        }
        Update: {
          exclude_date?: string[]
          exclude_monthly_day?: number[]
          exclude_week_day?: number[]
          id?: number
          restaurant_id?: number
          time_interval?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_reserver_business_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_reserver"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_reserver_control: {
        Row: {
          enable: boolean
          restaurant_id: number
        }
        Insert: {
          enable?: boolean
          restaurant_id: number
        }
        Update: {
          enable?: boolean
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_reserver_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_reserver"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_reserver_open_hour: {
        Row: {
          discount: number
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          discount?: number
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          discount?: number
          end_time?: string
          restaurant_id?: number
          start_time?: string
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "service_reserver_open_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_reserver"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_reserver_payment_type_control: {
        Row: {
          data: Json | null
          enable: boolean
          payment_type_code: string
          restaurant_id: number
        }
        Insert: {
          data?: Json | null
          enable?: boolean
          payment_type_code: string
          restaurant_id: number
        }
        Update: {
          data?: Json | null
          enable?: boolean
          payment_type_code?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_reserver_payment_type_control_payment_type_code_fkey"
            columns: ["payment_type_code"]
            isOneToOne: false
            referencedRelation: "payment_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "service_reserver_payment_type_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_reserver"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_reserver_record: {
        Row: {
          created_at: string
          data: Json | null
          id: number
          record_no: number
          restaurant_id: number
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: number
          record_no: number
          restaurant_id: number
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: number
          record_no?: number
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_reserver_record_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reserver_spacial_day: {
        Row: {
          day: number | null
          enable: boolean
          end_time: string | null
          id: number
          month: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day: number | null
          year: number | null
        }
        Insert: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day?: number | null
          year?: number | null
        }
        Update: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id?: number
          start_time?: string
          text?: string
          week_day?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_reserver_spacial_day_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_reserver"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_takeaway: {
        Row: {
          created_at: string
          paid_on: string
          restaurant_id: number
        }
        Insert: {
          created_at?: string
          paid_on?: string
          restaurant_id: number
        }
        Update: {
          created_at?: string
          paid_on?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      service_takeaway_business_hour: {
        Row: {
          exclude_date: string[]
          exclude_monthly_day: number[]
          exclude_week_day: number[]
          id: number
          restaurant_id: number
          time_interval: number
        }
        Insert: {
          exclude_date?: string[]
          exclude_monthly_day?: number[]
          exclude_week_day?: number[]
          id?: number
          restaurant_id: number
          time_interval?: number
        }
        Update: {
          exclude_date?: string[]
          exclude_monthly_day?: number[]
          exclude_week_day?: number[]
          id?: number
          restaurant_id?: number
          time_interval?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_business_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_takeaway"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_takeaway_control: {
        Row: {
          business_hour_information_card: boolean
          enable: boolean
          price_information_card: boolean
          restaurant_id: number
          view_model_id: number
        }
        Insert: {
          business_hour_information_card?: boolean
          enable?: boolean
          price_information_card?: boolean
          restaurant_id: number
          view_model_id?: number
        }
        Update: {
          business_hour_information_card?: boolean
          enable?: boolean
          price_information_card?: boolean
          restaurant_id?: number
          view_model_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_takeaway"
            referencedColumns: ["restaurant_id"]
          },
          {
            foreignKeyName: "service_takeaway_control_view_model_id_fkey"
            columns: ["view_model_id"]
            isOneToOne: false
            referencedRelation: "view_model"
            referencedColumns: ["id"]
          },
        ]
      }
      service_takeaway_information: {
        Row: {
          restaurant_id: number
        }
        Insert: {
          restaurant_id: number
        }
        Update: {
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_information_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "service_takeaway"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_takeaway_information_background: {
        Row: {
          id: number
          image_path: string
          restaurant_id: number
          screen_type: Database["public"]["Enums"]["screen_type"]
          weight: number
        }
        Insert: {
          id?: number
          image_path: string
          restaurant_id: number
          screen_type: Database["public"]["Enums"]["screen_type"]
          weight?: number
        }
        Update: {
          id?: number
          image_path?: string
          restaurant_id?: number
          screen_type?: Database["public"]["Enums"]["screen_type"]
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_information_background_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_takeaway"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_takeaway_information_card: {
        Row: {
          enable: boolean
          icon: string | null
          id: number
          information_card_type_id: number
          restaurant_id: number
          weight: number
        }
        Insert: {
          enable?: boolean
          icon?: string | null
          id?: number
          information_card_type_id: number
          restaurant_id: number
          weight?: number
        }
        Update: {
          enable?: boolean
          icon?: string | null
          id?: number
          information_card_type_id?: number
          restaurant_id?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_information_card_information_card_type_id_fkey"
            columns: ["information_card_type_id"]
            isOneToOne: false
            referencedRelation: "information_card_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_takeaway_information_card_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_takeaway"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_takeaway_information_card_message_multilingua: {
        Row: {
          language_code: string
          service_takeaway_information_card_id: number
          text: string | null
        }
        Insert: {
          language_code: string
          service_takeaway_information_card_id: number
          text?: string | null
        }
        Update: {
          language_code?: string
          service_takeaway_information_card_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_information_card_message_mu_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "service_takeaway_information_service_takeaway_information_fkey1"
            columns: ["service_takeaway_information_card_id"]
            isOneToOne: false
            referencedRelation: "service_takeaway_information_card"
            referencedColumns: ["id"]
          },
        ]
      }
      service_takeaway_information_card_title_multilingua: {
        Row: {
          language_code: string
          service_takeaway_information_card_id: number
          text: string | null
        }
        Insert: {
          language_code: string
          service_takeaway_information_card_id: number
          text?: string | null
        }
        Update: {
          language_code?: string
          service_takeaway_information_card_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_information__service_takeaway_information_fkey"
            columns: ["service_takeaway_information_card_id"]
            isOneToOne: false
            referencedRelation: "service_takeaway_information_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_takeaway_information_card_title_mult_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
        ]
      }
      service_takeaway_open_hour: {
        Row: {
          discount: number
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          discount?: number
          end_time: string
          restaurant_id: number
          start_time: string
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          discount?: number
          end_time?: string
          restaurant_id?: number
          start_time?: string
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_open_hour_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_takeaway"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_takeaway_payment_type_control: {
        Row: {
          data: Json | null
          enable: boolean
          payment_type_code: string
          restaurant_id: number
        }
        Insert: {
          data?: Json | null
          enable?: boolean
          payment_type_code: string
          restaurant_id: number
        }
        Update: {
          data?: Json | null
          enable?: boolean
          payment_type_code?: string
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_payment_type_control_payment_type_code_fkey"
            columns: ["payment_type_code"]
            isOneToOne: false
            referencedRelation: "payment_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "service_takeaway_payment_type_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_takeaway"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_takeaway_record: {
        Row: {
          created_at: string
          data: Json | null
          id: number
          record_no: number
          restaurant_id: number
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: number
          record_no: number
          restaurant_id: number
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: number
          record_no?: number
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_record_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      service_takeaway_spacial_day: {
        Row: {
          day: number | null
          enable: boolean
          end_time: string | null
          id: number
          month: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day: number | null
          year: number | null
        }
        Insert: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id: number
          start_time: string
          text: string
          week_day?: number | null
          year?: number | null
        }
        Update: {
          day?: number | null
          enable?: boolean
          end_time?: string | null
          id?: number
          month?: number | null
          restaurant_id?: number
          start_time?: string
          text?: string
          week_day?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_takeaway_spacial_day_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "service_takeaway"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      service_view_control: {
        Row: {
          restaurant_id: number
          service_type: string
          show: boolean
          tags: string[]
        }
        Insert: {
          restaurant_id: number
          service_type: string
          show?: boolean
          tags?: string[]
        }
        Update: {
          restaurant_id?: number
          service_type?: string
          show?: boolean
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "service_view_control_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_type: {
        Row: {
          id: number
          text: string
        }
        Insert: {
          id?: number
          text: string
        }
        Update: {
          id?: number
          text?: string
        }
        Relationships: []
      }
      staff_invitation: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          invited_by: string
          invited_user_id: string
          restaurant_id: number
          restaurant_role_id: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          invited_by: string
          invited_user_id: string
          restaurant_id: number
          restaurant_role_id: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          invited_by?: string
          invited_user_id?: string
          restaurant_id?: number
          restaurant_role_id?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_invitation_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_invitation_restaurant_role_id_fkey"
            columns: ["restaurant_role_id"]
            isOneToOne: false
            referencedRelation: "restaurant_role"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_restaurant_service_override: {
        Row: {
          enable: boolean
          restaurant_id: number
          service_type: string
          show: boolean | null
          tags: string[] | null
        }
        Insert: {
          enable?: boolean
          restaurant_id: number
          service_type: string
          show?: boolean | null
          tags?: string[] | null
        }
        Update: {
          enable?: boolean
          restaurant_id?: number
          service_type?: string
          show?: boolean | null
          tags?: string[] | null
        }
        Relationships: []
      }
      table_notification: {
        Row: {
          created_at: string
          description: string | null
          id: number
          message: string | null
          notification_type: string
          restaurant_id: number
          seen_at: string | null
          seen_by: string | null
          table_id: number
          table_start_time: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          message?: string | null
          notification_type: string
          restaurant_id: number
          seen_at?: string | null
          seen_by?: string | null
          table_id: number
          table_start_time: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          message?: string | null
          notification_type?: string
          restaurant_id?: number
          seen_at?: string | null
          seen_by?: string | null
          table_id?: number
          table_start_time?: number
        }
        Relationships: [
          {
            foreignKeyName: "table_notification_notification_type_fkey"
            columns: ["notification_type"]
            isOneToOne: false
            referencedRelation: "notification_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "table_notification_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_notification_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_table"
            referencedColumns: ["id"]
          },
        ]
      }
      table_payment: {
        Row: {
          created_at: string
          created_by: string | null
          customer_name: string | null
          discount_amount: number
          discount_type: string | null
          discount_value: number | null
          final_amount: number
          id: number
          invoice_error: string | null
          invoice_ref: string | null
          invoice_status: string
          nif: string | null
          note: string | null
          paid_at: string | null
          people_amount: number
          restaurant_id: number
          status: string
          table_id: number
          table_start_time: number
          tip_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_name?: string | null
          discount_amount?: number
          discount_type?: string | null
          discount_value?: number | null
          final_amount?: number
          id?: number
          invoice_error?: string | null
          invoice_ref?: string | null
          invoice_status?: string
          nif?: string | null
          note?: string | null
          paid_at?: string | null
          people_amount?: number
          restaurant_id: number
          status: string
          table_id: number
          table_start_time: number
          tip_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_name?: string | null
          discount_amount?: number
          discount_type?: string | null
          discount_value?: number | null
          final_amount?: number
          id?: number
          invoice_error?: string | null
          invoice_ref?: string | null
          invoice_status?: string
          nif?: string | null
          note?: string | null
          paid_at?: string | null
          people_amount?: number
          restaurant_id?: number
          status?: string
          table_id?: number
          table_start_time?: number
          tip_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_payment_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_payment_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_payment_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "table_payment_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "table_payment_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_table"
            referencedColumns: ["id"]
          },
        ]
      }
      table_payment_intent: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          customer_name: string | null
          entity: string | null
          expiry_date: string | null
          id: number
          method: string
          mobile_number: string | null
          nif: string | null
          paid_at: string | null
          payment_url: string | null
          reference: string | null
          request_id: string | null
          restaurant_id: number
          status: string
          superseded_by: number | null
          table_id: number
          table_start_time: number
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          customer_name?: string | null
          entity?: string | null
          expiry_date?: string | null
          id?: number
          method: string
          mobile_number?: string | null
          nif?: string | null
          paid_at?: string | null
          payment_url?: string | null
          reference?: string | null
          request_id?: string | null
          restaurant_id: number
          status?: string
          superseded_by?: number | null
          table_id: number
          table_start_time: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          customer_name?: string | null
          entity?: string | null
          expiry_date?: string | null
          id?: number
          method?: string
          mobile_number?: string | null
          nif?: string | null
          paid_at?: string | null
          payment_url?: string | null
          reference?: string | null
          request_id?: string | null
          restaurant_id?: number
          status?: string
          superseded_by?: number | null
          table_id?: number
          table_start_time?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_payment_intent_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_payment_intent_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "table_payment_intent"
            referencedColumns: ["id"]
          },
        ]
      }
      table_payment_item: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          id: number
          note: string | null
          payment_type_code: string
          restaurant_id: number
          status: string
          table_payment_id: number
          tip_amount: number
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          id?: number
          note?: string | null
          payment_type_code: string
          restaurant_id: number
          status?: string
          table_payment_id: number
          tip_amount?: number
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: number
          note?: string | null
          payment_type_code?: string
          restaurant_id?: number
          status?: string
          table_payment_id?: number
          tip_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "table_payment_item_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_payment_item_payment_type_code_fkey"
            columns: ["payment_type_code"]
            isOneToOne: false
            referencedRelation: "payment_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "table_payment_item_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_payment_item_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "table_payment_item_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "table_payment_item_table_payment_id_fkey"
            columns: ["table_payment_id"]
            isOneToOne: false
            referencedRelation: "table_payment"
            referencedColumns: ["id"]
          },
        ]
      }
      table_payment_item_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      table_payment_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      table_status: {
        Row: {
          code: string
          color_code: string
          text: string
          weight: number
        }
        Insert: {
          code: string
          color_code: string
          text: string
          weight?: number
        }
        Update: {
          code?: string
          color_code?: string
          text?: string
          weight?: number
        }
        Relationships: []
      }
      tag: {
        Row: {
          enable: boolean
          id: number
          image: string | null
          is_system: boolean
          restaurant_id: number | null
          text: string
          type: string
        }
        Insert: {
          enable?: boolean
          id?: number
          image?: string | null
          is_system?: boolean
          restaurant_id?: number | null
          text: string
          type?: string
        }
        Update: {
          enable?: boolean
          id?: number
          image?: string | null
          is_system?: boolean
          restaurant_id?: number | null
          text?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "tag_type"
            referencedColumns: ["code"]
          },
        ]
      }
      tag_multilingua: {
        Row: {
          language_code: string
          tag_id: number
          text: string | null
        }
        Insert: {
          language_code: string
          tag_id: number
          text?: string | null
        }
        Update: {
          language_code?: string
          tag_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tag_multilingua_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "tag_multilingua_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      tag_type: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      takeaway_order: {
        Row: {
          contact_name: string
          contact_phone: string
          created_at: string
          deleted_at: string | null
          email: string
          id: number
          note: string | null
          payment_status: string
          record_no: number
          restaurant_id: number
          status: string
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_name: string
          contact_phone: string
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: number
          note?: string | null
          payment_status?: string
          record_no: number
          restaurant_id: number
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_name?: string
          contact_phone?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: number
          note?: string | null
          payment_status?: string
          record_no?: number
          restaurant_id?: number
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "takeaway_order_payment_status_fkey"
            columns: ["payment_status"]
            isOneToOne: false
            referencedRelation: "takeaway_order_payment_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "takeaway_order_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takeaway_order_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "takeaway_order_status"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "takeaway_order_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      takeaway_order_item: {
        Row: {
          discount: number | null
          dish_id: number
          dish_sku: string
          id: number
          name: string | null
          parent_item_id: number | null
          price: number
          quantity: number
          restaurant_id: number
          takeaway_order_id: number
          updated_at: string
        }
        Insert: {
          discount?: number | null
          dish_id: number
          dish_sku: string
          id?: number
          name?: string | null
          parent_item_id?: number | null
          price: number
          quantity?: number
          restaurant_id: number
          takeaway_order_id: number
          updated_at?: string
        }
        Update: {
          discount?: number | null
          dish_id?: number
          dish_sku?: string
          id?: number
          name?: string | null
          parent_item_id?: number | null
          price?: number
          quantity?: number
          restaurant_id?: number
          takeaway_order_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "takeaway_order_item_parent_item_id_fkey"
            columns: ["parent_item_id"]
            isOneToOne: false
            referencedRelation: "takeaway_order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takeaway_order_item_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "takeaway_order_item_takeaway_order_id_fkey"
            columns: ["takeaway_order_id"]
            isOneToOne: false
            referencedRelation: "takeaway_order"
            referencedColumns: ["id"]
          },
        ]
      }
      takeaway_order_payment_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      takeaway_order_status: {
        Row: {
          code: string
          text: string
        }
        Insert: {
          code: string
          text: string
        }
        Update: {
          code?: string
          text?: string
        }
        Relationships: []
      }
      takeaway_print_model: {
        Row: {
          id: number
          print_model_code: string
          text: string
        }
        Insert: {
          id?: number
          print_model_code: string
          text: string
        }
        Update: {
          id?: number
          print_model_code?: string
          text?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          auth_type: string
          avatar_url: string | null
          created_at: string | null
          current_restaurant: number | null
          email: string
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          auth_type?: string
          avatar_url?: string | null
          created_at?: string | null
          current_restaurant?: number | null
          email: string
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          auth_type?: string
          avatar_url?: string | null
          created_at?: string | null
          current_restaurant?: number | null
          email?: string
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_dining_record: {
        Row: {
          created_at: string
          data: Json
          id: string
          restaurant_id: number
          service_type: string
          total_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          restaurant_id: number
          service_type: string
          total_price?: number
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          restaurant_id?: number
          service_type?: string
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dining_record_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_dining_record_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_restaurant_favorite: {
        Row: {
          dish_ids: number[]
          id: string
          restaurant_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          dish_ids?: number[]
          id?: string
          restaurant_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          dish_ids?: number[]
          id?: string
          restaurant_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_restaurant_favorite_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      user_restaurant_role: {
        Row: {
          restaurant_id: number
          restaurant_role_id: number
          user_id: string
        }
        Insert: {
          restaurant_id: number
          restaurant_role_id: number
          user_id: string
        }
        Update: {
          restaurant_id?: number
          restaurant_role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_restaurant_role_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_restaurant_role_restaurant_role_id_fkey"
            columns: ["restaurant_role_id"]
            isOneToOne: false
            referencedRelation: "restaurant_role"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role: {
        Row: {
          role_id: number
          user_id: string
        }
        Insert: {
          role_id: number
          user_id: string
        }
        Update: {
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      view_model: {
        Row: {
          id: number
          text: string
        }
        Insert: {
          id?: number
          text: string
        }
        Update: {
          id?: number
          text?: string
        }
        Relationships: []
      }
      view_sort: {
        Row: {
          dish_group_id: number | null
          dish_id: number | null
          enable: boolean
          id: number
          restaurant_id: number
          sale_channel: string
          view_tag_id: number | null
          weight: number
        }
        Insert: {
          dish_group_id?: number | null
          dish_id?: number | null
          enable?: boolean
          id?: number
          restaurant_id: number
          sale_channel: string
          view_tag_id?: number | null
          weight?: number
        }
        Update: {
          dish_group_id?: number | null
          dish_id?: number | null
          enable?: boolean
          id?: number
          restaurant_id?: number
          sale_channel?: string
          view_tag_id?: number | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "view_sort_dish_group_id_fkey"
            columns: ["dish_group_id"]
            isOneToOne: false
            referencedRelation: "dish_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_sort_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_sort_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_sort_sale_channel_fkey"
            columns: ["sale_channel"]
            isOneToOne: false
            referencedRelation: "sale_channel"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "view_sort_view_tag_id_fkey"
            columns: ["view_tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      yellow_king_internal_medicine: {
        Row: {
          dish_id: number
          language_code: string
          restaurant_id: number
          text: string | null
        }
        Insert: {
          dish_id: number
          language_code: string
          restaurant_id: number
          text?: string | null
        }
        Update: {
          dish_id?: number
          language_code?: string
          restaurant_id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "yellow_king_internal_medicine_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yellow_king_internal_medicine_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "yellow_king_internal_medicine_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: { Args: { p_invitation_id: string }; Returns: string }
      can_manage_restaurant_role: {
        Args: { p_restaurant_id: number; p_target_role_id: number }
        Returns: boolean
      }
      can_manage_sub_restaurant_service: {
        Args: { p_sub_rest_id: number; p_user_id: string }
        Returns: boolean
      }
      cancel_service_tx: {
        Args: {
          p_perm_codes: string[]
          p_restaurant_id: number
          p_service: string
        }
        Returns: undefined
      }
      create_custom_dish: {
        Args: {
          p_category_id?: number
          p_delivery_price?: number
          p_descriptions?: Json
          p_groups?: Json
          p_names?: Json
          p_options?: Json
          p_price?: number
          p_print_text?: string
          p_restaurant_id: number
          p_sale_channels?: string[]
          p_sku: string
          p_status?: string
          p_tax_rate?: string
        }
        Returns: Json
      }
      create_dish: {
        Args: {
          p_allergens_tags?: Json
          p_category_id?: number
          p_delivery_discount?: number
          p_delivery_price?: number
          p_descriptions?: Json
          p_discount?: number
          p_names?: Json
          p_order_limit?: number
          p_price?: number
          p_print_tags?: Json
          p_print_text?: string
          p_property_tags?: Json
          p_restaurant_id: number
          p_sale_channel?: string[]
          p_sku: string
          p_status: string
          p_table_limit?: number
          p_tax_rate?: string
          p_yellow_king?: Json
        }
        Returns: number
      }
      create_restaurant_tx: {
        Args: {
          p_city: string
          p_code: string
          p_country: string
          p_email: string
          p_name: string
          p_nif: string
          p_phone: string
          p_post_code: string
          p_region: string
          p_street: string
          p_user_id: string
        }
        Returns: number
      }
      fn_archive_daily_orders: {
        Args: { p_date?: string; p_restaurant_id: number }
        Returns: Json
      }
      get_people_price: {
        Args: {
          p_date: string
          p_people_type_id: number
          p_restaurant_id: number
          p_time: string
        }
        Returns: number
      }
      has_restaurant_role_permission: {
        Args: {
          p_permission_code: string
          p_restaurant_id: number
          p_user_id: string
        }
        Returns: boolean
      }
      has_role: { Args: { p_role_name: string }; Returns: boolean }
      increment_dish_rate: {
        Args: { p_dish_id: number; p_like: boolean; p_restaurant_id: number }
        Returns: {
          likes: number
          rates: number
        }[]
      }
      invite_staff: {
        Args: { p_email: string; p_restaurant_id: number; p_role_id: number }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_merchant: { Args: never; Returns: boolean }
      my_restaurant_permission: {
        Args: { p_permission_code: string; p_restaurant_id: number }
        Returns: boolean
      }
      my_restaurant_permissions: {
        Args: { p_restaurant_id: number }
        Returns: string[]
      }
      place_order: {
        Args: {
          p_items: Json
          p_note_description?: string
          p_note_name?: string
          p_table_id: number
        }
        Returns: number
      }
      reject_invitation: { Args: { p_invitation_id: string }; Returns: string }
      remove_dish_from_table: {
        Args: {
          p_dish_id: number
          p_quantity: number
          p_restaurant_id: number
          p_table_id: number
          p_table_start_time: number
        }
        Returns: undefined
      }
      set_view_sort_weight: {
        Args: {
          p_dish_group_id?: number
          p_dish_id?: number
          p_enable?: boolean
          p_restaurant_id: number
          p_sale_channel: string
          p_view_tag_id?: number
          p_weight: number
        }
        Returns: number
      }
      upsert_service_tx: {
        Args: {
          p_perm_codes: string[]
          p_restaurant_id: number
          p_service_type: string
        }
        Returns: undefined
      }
    }
    Enums: {
      dining_mode: "per_item" | "per_person"
      dish_relation_type: "sdr" | "linked_dish"
      restaurant_default_role: "boss" | "manager" | "staff"
      screen_type: "mobile" | "tablet" | "desktop"
      weekday:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
        | "holiday"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      dining_mode: ["per_item", "per_person"],
      dish_relation_type: ["sdr", "linked_dish"],
      restaurant_default_role: ["boss", "manager", "staff"],
      screen_type: ["mobile", "tablet", "desktop"],
      weekday: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
        "holiday",
      ],
    },
  },
} as const

