package Nhom21.weboto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompareResponse {
    private List<PartDTO> parts;
    private List<String> comparableFields;
    private Map<String, List<String>> comparisonRows;
}
