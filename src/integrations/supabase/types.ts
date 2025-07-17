export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      access_logs: {
        Row: {
          action: string | null
          id: string
          status: string | null
          time: string | null
          user_name: string | null
        }
        Insert: {
          action?: string | null
          id?: string
          status?: string | null
          time?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string | null
          id?: string
          status?: string | null
          time?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          attendance_date: string
          created_at: string
          event_id: string
          id: string
          member_id: string
          notes: string | null
          recorded_by: string
          status: string
        }
        Insert: {
          attendance_date?: string
          created_at?: string
          event_id: string
          id?: string
          member_id: string
          notes?: string | null
          recorded_by: string
          status?: string
        }
        Update: {
          attendance_date?: string
          created_at?: string
          event_id?: string
          id?: string
          member_id?: string
          notes?: string | null
          recorded_by?: string
          status?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_study_attendance: {
        Row: {
          attendance_date: string
          created_at: string | null
          group_id: string | null
          id: string
          member_id: string | null
          notes: string | null
          recorded_by: string | null
          status: string | null
        }
        Insert: {
          attendance_date: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          recorded_by?: string | null
          status?: string | null
        }
        Update: {
          attendance_date?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          recorded_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_attendance_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "bible_study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_study_attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_study_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          leader_id: string | null
          location: string | null
          meeting_day: string | null
          meeting_time: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          location?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          location?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      budget: {
        Row: {
          category: string | null
          id: string
          planned: number | null
          spent: number | null
        }
        Insert: {
          category?: string | null
          id?: string
          planned?: number | null
          spent?: number | null
        }
        Update: {
          category?: string | null
          id?: string
          planned?: number | null
          spent?: number | null
        }
        Relationships: []
      }
      budget_categories: {
        Row: {
          allocated_amount: number
          budget_year: number
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          spent_amount: number
          updated_at: string
        }
        Insert: {
          allocated_amount?: number
          budget_year?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          spent_amount?: number
          updated_at?: string
        }
        Update: {
          allocated_amount?: number
          budget_year?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          spent_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          created_at: string | null
          end_date: string
          id: string
          name: string
          start_date: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          goal_amount: number | null
          id: string
          name: string
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goal_amount?: number | null
          id?: string
          name: string
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goal_amount?: number | null
          id?: string
          name?: string
          start_date?: string | null
        }
        Relationships: []
      }
      church_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      church_settings: {
        Row: {
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          template_type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          content: string
          id: string
          is_urgent: boolean
          sent_at: string
          sent_by: string
          status: string
          target_audience: string[] | null
          title: string
          type: string
        }
        Insert: {
          content: string
          id?: string
          is_urgent?: boolean
          sent_at?: string
          sent_by: string
          status?: string
          target_audience?: string[] | null
          title: string
          type?: string
        }
        Update: {
          content?: string
          id?: string
          is_urgent?: boolean
          sent_at?: string
          sent_by?: string
          status?: string
          target_audience?: string[] | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          date: string | null
          id: string
          title: string | null
          type: string | null
        }
        Insert: {
          date?: string | null
          id?: string
          title?: string | null
          type?: string | null
        }
        Update: {
          date?: string | null
          id?: string
          title?: string | null
          type?: string | null
        }
        Relationships: []
      }
      counseling_sessions: {
        Row: {
          counselor_id: string | null
          created_at: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          member_id: string | null
          notes: string | null
          session_date: string
          session_time: string | null
          status: string | null
          topic: string
        }
        Insert: {
          counselor_id?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          member_id?: string | null
          notes?: string | null
          session_date: string
          session_time?: string | null
          status?: string | null
          topic: string
        }
        Update: {
          counselor_id?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          member_id?: string | null
          notes?: string | null
          session_date?: string
          session_time?: string | null
          status?: string | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "counseling_sessions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_campaigns: {
        Row: {
          created_at: string
          created_by: string
          current_amount: number
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          start_date: string
          target_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_amount?: number
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          start_date?: string
          target_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_amount?: number
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
          target_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          currency: string | null
          donation_date: string | null
          donation_type: Database["public"]["Enums"]["donation_type"]
          donor_id: string | null
          id: string
          is_anonymous: boolean | null
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          purpose: string | null
          receipt_issued: boolean | null
          receipt_number: string | null
          recorded_by: string
          reference_number: string | null
          transaction_date: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string | null
          donation_date?: string | null
          donation_type: Database["public"]["Enums"]["donation_type"]
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          purpose?: string | null
          receipt_issued?: boolean | null
          receipt_number?: string | null
          recorded_by: string
          reference_number?: string | null
          transaction_date?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string | null
          donation_date?: string | null
          donation_type?: Database["public"]["Enums"]["donation_type"]
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          purpose?: string | null
          receipt_issued?: boolean | null
          receipt_number?: string | null
          recorded_by?: string
          reference_number?: string | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          attendance_status: string | null
          event_id: string
          id: string
          notes: string | null
          registration_date: string | null
          user_id: string
        }
        Insert: {
          attendance_status?: string | null
          event_id: string
          id?: string
          notes?: string | null
          registration_date?: string | null
          user_id: string
        }
        Update: {
          attendance_status?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          registration_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_resources: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          quantity: number | null
          resource_name: string
          resource_type: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          quantity?: number | null
          resource_name: string
          resource_type: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          quantity?: number | null
          resource_name?: string
          resource_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_resources_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          event_date: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          is_recurring: boolean | null
          location: string | null
          max_attendees: number | null
          organizer_id: string | null
          recurrence_pattern: string | null
          registration_deadline: string | null
          registration_required: boolean | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          event_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          max_attendees?: number | null
          organizer_id?: string | null
          recurrence_pattern?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          event_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          max_attendees?: number | null
          organizer_id?: string | null
          recurrence_pattern?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string
          expense_date: string
          id: string
          member_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description: string
          expense_date: string
          id?: string
          member_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string
          expense_date?: string
          id?: string
          member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          account_name: string
          account_number: string | null
          account_type: string
          bank_name: string | null
          created_at: string | null
          current_balance: number | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number?: string | null
          account_type: string
          bank_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string | null
          account_type?: string
          bank_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          account_id: string
          amount: number
          approval_status: string | null
          approved_by: string | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          notes: string | null
          recorded_by: string
          reference_number: string | null
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          account_id: string
          amount: number
          approval_status?: string | null
          approved_by?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          notes?: string | null
          recorded_by: string
          reference_number?: string | null
          transaction_date?: string
          transaction_type: string
        }
        Update: {
          account_id?: string
          amount?: number
          approval_status?: string | null
          approved_by?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          notes?: string | null
          recorded_by?: string
          reference_number?: string | null
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      household_members: {
        Row: {
          created_at: string | null
          household_id: string
          id: string
          is_head: boolean | null
          member_id: string
          relationship: string | null
        }
        Insert: {
          created_at?: string | null
          household_id: string
          id?: string
          is_head?: boolean | null
          member_id: string
          relationship?: string | null
        }
        Update: {
          created_at?: string | null
          household_id?: string
          id?: string
          is_head?: boolean | null
          member_id?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          head_of_household_id: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          head_of_household_id?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          head_of_household_id?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "households_head_of_household_id_fkey"
            columns: ["head_of_household_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          baptism_date: string | null
          city: string | null
          confirmation_date: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          gender: string | null
          household_id: string | null
          id: string
          join_date: string
          joined_at: string | null
          marital_status: string | null
          membership_number: string
          ministry_involvement: string[] | null
          notes: string | null
          occupation: string | null
          phone: string | null
          status: Database["public"]["Enums"]["member_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          baptism_date?: string | null
          city?: string | null
          confirmation_date?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          household_id?: string | null
          id?: string
          join_date?: string
          joined_at?: string | null
          marital_status?: string | null
          membership_number: string
          ministry_involvement?: string[] | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          baptism_date?: string | null
          city?: string | null
          confirmation_date?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          household_id?: string | null
          id?: string
          join_date?: string
          joined_at?: string | null
          marital_status?: string | null
          membership_number?: string
          ministry_involvement?: string[] | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_recipients: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          delivery_status: string | null
          id: string
          message_id: string
          read_at: string | null
          recipient_id: string | null
          recipient_type: string
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          id?: string
          message_id: string
          read_at?: string | null
          recipient_id?: string | null
          recipient_type: string
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          id?: string
          message_id?: string
          read_at?: string | null
          recipient_id?: string | null
          recipient_type?: string
        }
        Relationships: []
      }
      ministries: {
        Row: {
          co_leader_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          leader_id: string | null
          meeting_day: string | null
          meeting_location: string | null
          meeting_time: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          co_leader_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          co_leader_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ministries_co_leader_id_fkey"
            columns: ["co_leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministries_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_members: {
        Row: {
          id: string
          is_active: boolean | null
          joined_date: string | null
          member_id: string
          ministry_id: string
          role: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          joined_date?: string | null
          member_id: string
          ministry_id: string
          role?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          joined_date?: string | null
          member_id?: string
          ministry_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ministry_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministry_members_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          donation_receipts: boolean | null
          email_notifications: boolean | null
          event_reminders: boolean | null
          id: string
          newsletter: boolean | null
          prayer_updates: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string
          whatsapp_notifications: boolean | null
        }
        Insert: {
          created_at?: string | null
          donation_receipts?: boolean | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          id?: string
          newsletter?: boolean | null
          prayer_updates?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
          whatsapp_notifications?: boolean | null
        }
        Update: {
          created_at?: string | null
          donation_receipts?: boolean | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          id?: string
          newsletter?: boolean | null
          prayer_updates?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
          whatsapp_notifications?: boolean | null
        }
        Relationships: []
      }
      pastoral_visits: {
        Row: {
          created_at: string
          follow_up_date: string | null
          follow_up_required: boolean
          id: string
          member_id: string
          notes: string | null
          purpose: string
          status: string
          visit_date: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          follow_up_date?: string | null
          follow_up_required?: boolean
          id?: string
          member_id: string
          notes?: string | null
          purpose: string
          status?: string
          visit_date?: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          follow_up_date?: string | null
          follow_up_required?: boolean
          id?: string
          member_id?: string
          notes?: string | null
          purpose?: string
          status?: string
          visit_date?: string
          visitor_id?: string
        }
        Relationships: []
      }
      pledges: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          id: string
          member_id: string | null
          pledge_date: string
          status: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          pledge_date: string
          status?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          pledge_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pledges_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pledges_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          created_at: string
          description: string
          id: string
          is_anonymous: boolean
          is_urgent: boolean
          requester_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_anonymous?: boolean
          is_urgent?: boolean
          requester_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_anonymous?: boolean
          is_urgent?: boolean
          requester_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prayer_responses: {
        Row: {
          id: string
          is_private: boolean | null
          prayer_request_id: string
          responder_id: string
          response_date: string | null
          response_text: string
        }
        Insert: {
          id?: string
          is_private?: boolean | null
          prayer_request_id: string
          responder_id: string
          response_date?: string | null
          response_text: string
        }
        Update: {
          id?: string
          is_private?: boolean | null
          prayer_request_id?: string
          responder_id?: string
          response_date?: string | null
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_responses_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          baptism_status: boolean | null
          city: string | null
          confirmation_status: boolean | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          household_id: string | null
          id: string
          last_name: string
          marital_status: string | null
          next_of_kin_name: string | null
          next_of_kin_phone: string | null
          next_of_kin_relationship: string | null
          occupation: string | null
          phone: string | null
          profile_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          baptism_status?: boolean | null
          city?: string | null
          confirmation_status?: boolean | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          household_id?: string | null
          id: string
          last_name: string
          marital_status?: string | null
          next_of_kin_name?: string | null
          next_of_kin_phone?: string | null
          next_of_kin_relationship?: string | null
          occupation?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          baptism_status?: boolean | null
          city?: string | null
          confirmation_status?: boolean | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          household_id?: string | null
          id?: string
          last_name?: string
          marital_status?: string | null
          next_of_kin_name?: string | null
          next_of_kin_phone?: string | null
          next_of_kin_relationship?: string | null
          occupation?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recurring_donations: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          donor_id: string | null
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean | null
          next_donation_date: string | null
          payment_method: string | null
          purpose: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          donor_id?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          next_donation_date?: string | null
          payment_method?: string | null
          purpose?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          donor_id?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          next_donation_date?: string | null
          payment_method?: string | null
          purpose?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          date: string | null
          id: string
          title: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          date?: string | null
          id?: string
          title?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          date?: string | null
          id?: string
          title?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: []
      }
      resource_bookings: {
        Row: {
          booked_by: string | null
          booking_date: string
          created_at: string | null
          end_time: string | null
          event_id: string | null
          id: string
          notes: string | null
          resource_name: string
          resource_type: string
          start_time: string | null
          status: string | null
        }
        Insert: {
          booked_by?: string | null
          booking_date: string
          created_at?: string | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          resource_name: string
          resource_type: string
          start_time?: string | null
          status?: string | null
        }
        Update: {
          booked_by?: string | null
          booking_date?: string
          created_at?: string | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          resource_name?: string
          resource_type?: string
          start_time?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string
          date_preached: string
          id: string
          preacher_id: string
          scripture_reference: string | null
          summary: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          date_preached?: string
          id?: string
          preacher_id: string
          scripture_reference?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          date_preached?: string
          id?: string
          preacher_id?: string
          scripture_reference?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      spiritual_milestones: {
        Row: {
          certificate_issued: boolean | null
          created_at: string | null
          id: string
          location: string | null
          member_id: string
          milestone_date: string
          milestone_type: string
          notes: string | null
          officiant_id: string | null
        }
        Insert: {
          certificate_issued?: boolean | null
          created_at?: string | null
          id?: string
          location?: string | null
          member_id: string
          milestone_date: string
          milestone_type: string
          notes?: string | null
          officiant_id?: string | null
        }
        Update: {
          certificate_issued?: boolean | null
          created_at?: string | null
          id?: string
          location?: string | null
          member_id?: string
          milestone_date?: string
          milestone_type?: string
          notes?: string | null
          officiant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spiritual_milestones_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          contract_type: string | null
          created_at: string | null
          department: string
          employee_id: string
          hire_date: string
          id: string
          is_active: boolean | null
          position: string
          salary: number | null
          supervisor_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contract_type?: string | null
          created_at?: string | null
          department: string
          employee_id: string
          hire_date: string
          id?: string
          is_active?: boolean | null
          position: string
          salary?: number | null
          supervisor_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contract_type?: string | null
          created_at?: string | null
          department?: string
          employee_id?: string
          hire_date?: string
          id?: string
          is_active?: boolean | null
          position?: string
          salary?: number | null
          supervisor_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_events: {
        Row: {
          action: string
          created_at: string | null
          event_type: string | null
          id: string
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          event_type?: string | null
          id?: string
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          event_type?: string | null
          id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string | null
          recipient_id: string
          title: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type?: string | null
          recipient_id: string
          title: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string | null
          recipient_id?: string
          title?: string
        }
        Relationships: []
      }
      system_stats: {
        Row: {
          change_description: string | null
          change_value: string | null
          id: string
          stat_type: string
          updated_at: string | null
          value: string
        }
        Insert: {
          change_description?: string | null
          change_value?: string | null
          id?: string
          stat_type: string
          updated_at?: string | null
          value: string
        }
        Update: {
          change_description?: string | null
          change_value?: string | null
          id?: string
          stat_type?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      tithes: {
        Row: {
          amount: number | null
          date: string | null
          donor: string | null
          id: string
          method: string | null
        }
        Insert: {
          amount?: number | null
          date?: string | null
          donor?: string | null
          id?: string
          method?: string | null
        }
        Update: {
          amount?: number | null
          date?: string | null
          donor?: string | null
          id?: string
          method?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          created_at: string | null
          department: string
          end_date: string | null
          hours_per_week: number | null
          id: string
          is_active: boolean | null
          role: string
          skills: string[] | null
          start_date: string | null
          supervisor_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          end_date?: string | null
          hours_per_week?: number | null
          id?: string
          is_active?: boolean | null
          role: string
          skills?: string[] | null
          start_date?: string | null
          supervisor_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          end_date?: string | null
          hours_per_week?: number | null
          id?: string
          is_active?: boolean | null
          role?: string
          skills?: string[] | null
          start_date?: string | null
          supervisor_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          message_content: string
          message_type: string
          recipient_phone: string
          sent_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message_content: string
          message_type: string
          recipient_phone: string
          sent_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message_content?: string
          message_type?: string
          recipient_phone?: string
          sent_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_members: number
          new_members_this_month: number
          upcoming_events: number
          total_donations: number
          monthly_donations: number
          active_ministries: number
          pending_communications: number
          prayer_requests: number
        }[]
      }
      get_system_resources: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          db_size: string
          active_connections: number
        }[]
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          user_uuid: string
          required_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin_or_clergy: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      donation_type: "tithe" | "offering" | "special" | "project" | "missions"
      event_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      event_type:
        | "service"
        | "meeting"
        | "conference"
        | "social"
        | "outreach"
        | "other"
      member_status: "active" | "inactive" | "deceased" | "transferred"
      message_status: "draft" | "sent" | "failed" | "delivered"
      message_type:
        | "announcement"
        | "reminder"
        | "alert"
        | "newsletter"
        | "prayer_update"
      ministry_role: "leader" | "co_leader" | "member" | "volunteer"
      payment_method:
        | "cash"
        | "check"
        | "card"
        | "bank_transfer"
        | "mobile_money"
      user_role:
        | "system_admin"
        | "clergy"
        | "treasurer"
        | "secretary"
        | "member"
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
      donation_type: ["tithe", "offering", "special", "project", "missions"],
      event_status: ["scheduled", "in_progress", "completed", "cancelled"],
      event_type: [
        "service",
        "meeting",
        "conference",
        "social",
        "outreach",
        "other",
      ],
      member_status: ["active", "inactive", "deceased", "transferred"],
      message_status: ["draft", "sent", "failed", "delivered"],
      message_type: [
        "announcement",
        "reminder",
        "alert",
        "newsletter",
        "prayer_update",
      ],
      ministry_role: ["leader", "co_leader", "member", "volunteer"],
      payment_method: [
        "cash",
        "check",
        "card",
        "bank_transfer",
        "mobile_money",
      ],
      user_role: ["system_admin", "clergy", "treasurer", "secretary", "member"],
    },
  },
} as const
