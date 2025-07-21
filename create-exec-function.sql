-- =====================================================
-- Create exec_sql function for dynamic SQL execution
-- =====================================================

-- Create the exec_sql function that allows dynamic SQL execution
CREATE OR REPLACE FUNCTION public.exec_sql(sql_text text)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    -- Execute the SQL and return results as JSON
    EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || sql_text || ') t' INTO result;
    
    -- If no results, return empty array
    IF result IS NULL THEN
        result := '[]'::json;
    END IF;
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- Return error information as JSON
        RETURN json_build_object(
            'error', true,
            'message', SQLERRM,
            'detail', SQLSTATE
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO authenticated;

-- Test the function
SELECT 'Function created successfully' as status; 