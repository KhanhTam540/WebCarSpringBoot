package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageSearchResponse {
    private String storedImageUrl;
    private String matchedTag;
    private Boolean isAiResult;
    private String status; // SUCCESS, AI_INITIALIZING, FALLBACK_KEYWORD
    private String aiStatus; // e.g. "AI Ready (50/50 items indexed)"
    private List<ImageSearchResultItem> suggestions;
}
