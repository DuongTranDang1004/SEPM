package org.example.Broomate.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class SupabaseConfig {

    @Value("${supabase.url}")
    private String supabaseUrl;



    @Value("${supabase.bucket}")
    private String bucket;

    @Value("${supabase.region}")
    private String region;
    @Value("${supabase.api-key}")
    private String apiKey;

    /**
     * Get the public URL for accessing files
     */
    public String getPublicUrl(String filePath) {
        return String.format("%s/storage/v1/object/public/%s/%s",
                supabaseUrl, bucket, filePath);
    }

    /**
     * Get the storage API endpoint
     */
    public String getStorageEndpoint() {
        return supabaseUrl + "/storage/v1/object/" + bucket;
    }
}