package runus.runus.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.api.ApiResponse;
import runus.runus.board.dto.RegionMajorDTO;
import runus.runus.board.dto.RegionMinorDTO;
import runus.runus.board.service.RegionService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RegionController {

    @Autowired
    private RegionService regionService;

    @GetMapping("/region-major")
    public ResponseEntity<?> getMajorRegions() {
        List<RegionMajorDTO> regions = regionService.getAllMajorRegions();
        return ResponseEntity.ok(new ApiResponse<>(true, regions, "성공"));
    }

    @GetMapping("/region-major/{majorId}")
    public ResponseEntity<?> getMinorRegions(@PathVariable int majorId) {
        List<RegionMinorDTO> regions = regionService.getMinorRegionsByMajorId(majorId);
        return ResponseEntity.ok(new ApiResponse<>(true, regions, "성공"));
    }
}
