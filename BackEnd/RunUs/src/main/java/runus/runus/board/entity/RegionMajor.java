package runus.runus.board.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "region_major")
public class RegionMajor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int regionMajorId;
    private String regionMajorName;

    // Getters and setters
    public int getRegionMajorId() {
        return regionMajorId;
    }

    public void setRegionMajorId(int regionMajorId) {
        this.regionMajorId = regionMajorId;
    }

    public String getRegionMajorName() {
        return regionMajorName;
    }

    public void setRegionMajorName(String regionMajorName) {
        this.regionMajorName = regionMajorName;
    }
}
