package runus.runus.board.dto;

public class RegionMinorDTO {
    private int id;
    private String name;

    // Constructors, getters, and setters
    public RegionMinorDTO(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
