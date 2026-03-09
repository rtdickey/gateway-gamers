export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type AppRole = "admin" | "contributor" | "user"
export type FriendshipStatus = "pending" | "accepted" | "declined"

export type Database = {
  public: {
    Tables: {
      friendships: {
        Row: {
          id: string
          created_at: string
          requester_id: string
          addressee_id: string
          status: FriendshipStatus
        }
        Insert: {
          id?: string
          created_at?: string
          requester_id: string
          addressee_id: string
          status?: FriendshipStatus
        }
        Update: {
          id?: string
          created_at?: string
          requester_id?: string
          addressee_id?: string
          status?: FriendshipStatus
        }
        Relationships: [
          {
            foreignKeyName: "friendships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          id: string
          created_at: string
          user_game_id: number
          borrower: string
          borrower_id: string | null
          loaned_at: string
          returned_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_game_id: number
          borrower: string
          borrower_id?: string | null
          loaned_at?: string
          returned_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_game_id?: number
          borrower?: string
          borrower_id?: string | null
          loaned_at?: string
          returned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_user_game_id_fkey"
            columns: ["user_game_id"]
            isOneToOne: false
            referencedRelation: "user_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          age: number | null
          bgg_id: number | null
          created_at: string
          id: string
          image: string | null
          is_expansion: boolean
          max_players: number | null
          min_players: number | null
          playing_time: number | null
          publisher: string | null
          thumbnail: string | null
          title: string | null
          year_published: number | null
        }
        Insert: {
          age?: number | null
          bgg_id?: number | null
          created_at?: string
          id?: string
          image?: string | null
          is_expansion: boolean
          max_players?: number | null
          min_players?: number | null
          playing_time?: number | null
          publisher?: string | null
          thumbnail?: string | null
          title?: string | null
          year_published?: number | null
        }
        Update: {
          age?: number | null
          bgg_id?: number | null
          created_at?: string
          id?: string
          image?: string | null
          is_expansion?: boolean
          max_players?: number | null
          min_players?: number | null
          playing_time?: number | null
          publisher?: string | null
          thumbnail?: string | null
          title?: string | null
          year_published?: number | null
        }
        Relationships: []
      }
      user_games: {
        Row: {
          created_at: string
          game_id: string
          id: number
          is_loaned: boolean
          is_private: boolean
          modified_at: string
          shelf: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: number
          is_loaned?: boolean
          is_private?: boolean
          modified_at?: string
          shelf?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: number
          is_loaned?: boolean
          is_private?: boolean
          modified_at?: string
          shelf?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          display_name: string | null
          email: string | null
          id: string
          role: AppRole
        }
        Insert: {
          display_name?: string | null
          email?: string | null
          id: string
          role?: AppRole
        }
        Update: {
          display_name?: string | null
          email?: string | null
          id?: string
          role?: AppRole
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: AppRole
      friendship_status: FriendshipStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
