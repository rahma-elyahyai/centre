package com.warriors.centre.dto;

import java.util.List;

public class CoursDto {

    // ════════════════════════════════════════════════════
    //  SeanceDto
    // ════════════════════════════════════════════════════
    public static class SeanceDto {
        private Long    id;
        private String  titre;
        private String  sousTitre;
        private String  description;
        private String  videoUrl;
        private String  imageUrl;
        private String  duree;
        private String  typeSeance;
        private Boolean disponible;
        private Integer ordre;

        public SeanceDto() {}

        public SeanceDto(Long id, String titre, String sousTitre, String description,
                         String videoUrl, String imageUrl, String duree,
                         String typeSeance, Boolean disponible, Integer ordre) {
            this.id = id; this.titre = titre; this.sousTitre = sousTitre;
            this.description = description; this.videoUrl = videoUrl;
            this.imageUrl = imageUrl; this.duree = duree;
            this.typeSeance = typeSeance; this.disponible = disponible; this.ordre = ordre;
        }

        public Long    getId()                        { return id; }
        public void    setId(Long id)                 { this.id = id; }
        public String  getTitre()                     { return titre; }
        public void    setTitre(String titre)         { this.titre = titre; }
        public String  getSousTitre()                 { return sousTitre; }
        public void    setSousTitre(String sousTitre) { this.sousTitre = sousTitre; }
        public String  getDescription()               { return description; }
        public void    setDescription(String desc)    { this.description = desc; }
        public String  getVideoUrl()                  { return videoUrl; }
        public void    setVideoUrl(String videoUrl)   { this.videoUrl = videoUrl; }
        public String  getImageUrl()                  { return imageUrl; }
        public void    setImageUrl(String imageUrl)   { this.imageUrl = imageUrl; }
        public String  getDuree()                     { return duree; }
        public void    setDuree(String duree)         { this.duree = duree; }
        public String  getTypeSeance()                { return typeSeance; }
        public void    setTypeSeance(String t)        { this.typeSeance = t; }
        public Boolean getDisponible()                { return disponible; }
        public void    setDisponible(Boolean d)       { this.disponible = d; }
        public Integer getOrdre()                     { return ordre; }
        public void    setOrdre(Integer ordre)        { this.ordre = ordre; }
    }

    // ════════════════════════════════════════════════════
    //  ModuleDto
    // ════════════════════════════════════════════════════
    public static class ModuleDto {
        private Long             id;
        private String           nom;
        private String           icon;
        private Integer          ordre;
        private List<SeanceDto>  seances;

        public ModuleDto() {}

        public ModuleDto(Long id, String nom, String icon,
                         Integer ordre, List<SeanceDto> seances) {
            this.id = id; this.nom = nom; this.icon = icon;
            this.ordre = ordre; this.seances = seances;
        }

        public Long            getId()                        { return id; }
        public void            setId(Long id)                 { this.id = id; }
        public String          getNom()                       { return nom; }
        public void            setNom(String nom)             { this.nom = nom; }
        public String          getIcon()                      { return icon; }
        public void            setIcon(String icon)           { this.icon = icon; }
        public Integer         getOrdre()                     { return ordre; }
        public void            setOrdre(Integer ordre)        { this.ordre = ordre; }
        public List<SeanceDto> getSeances()                   { return seances; }
        public void            setSeances(List<SeanceDto> s)  { this.seances = s; }
    }

    // ════════════════════════════════════════════════════
    //  MatiereDto  ← champ "color" AJOUTÉ
    // ════════════════════════════════════════════════════
    public static class MatiereDto {
        private Long             id;
        private String           nom;
        private String           icon;
        private String           color;        // ← couleur accent ex: "#3b82f6"
        private String           description;
        private Integer          ordre;
        private List<ModuleDto>  modules;

        public MatiereDto() {}

        public MatiereDto(Long id, String nom, String icon, String color,
                          String description, Integer ordre, List<ModuleDto> modules) {
            this.id = id; this.nom = nom; this.icon = icon; this.color = color;
            this.description = description; this.ordre = ordre; this.modules = modules;
        }

        public Long            getId()                        { return id; }
        public void            setId(Long id)                 { this.id = id; }
        public String          getNom()                       { return nom; }
        public void            setNom(String nom)             { this.nom = nom; }
        public String          getIcon()                      { return icon; }
        public void            setIcon(String icon)           { this.icon = icon; }
        public String          getColor()                     { return color; }
        public void            setColor(String color)         { this.color = color; }
        public String          getDescription()               { return description; }
        public void            setDescription(String desc)    { this.description = desc; }
        public Integer         getOrdre()                     { return ordre; }
        public void            setOrdre(Integer ordre)        { this.ordre = ordre; }
        public List<ModuleDto> getModules()                   { return modules; }
        public void            setModules(List<ModuleDto> m)  { this.modules = m; }
    }

    // ════════════════════════════════════════════════════
    //  NiveauDto  (arborescence complète)
    // ════════════════════════════════════════════════════
    public static class NiveauDto {
        private Long              id;
        private String            code;
        private String            label;
        private String            fullLabel;
        private String            emoji;
        private String            colorHex;
        private Integer           ordre;
        private List<MatiereDto>  matieres;

        public NiveauDto() {}

        public NiveauDto(Long id, String code, String label, String fullLabel,
                         String emoji, String colorHex, Integer ordre,
                         List<MatiereDto> matieres) {
            this.id = id; this.code = code; this.label = label;
            this.fullLabel = fullLabel; this.emoji = emoji;
            this.colorHex = colorHex; this.ordre = ordre; this.matieres = matieres;
        }

        public Long             getId()                         { return id; }
        public void             setId(Long id)                  { this.id = id; }
        public String           getCode()                       { return code; }
        public void             setCode(String code)            { this.code = code; }
        public String           getLabel()                      { return label; }
        public void             setLabel(String label)          { this.label = label; }
        public String           getFullLabel()                  { return fullLabel; }
        public void             setFullLabel(String v)          { this.fullLabel = v; }
        public String           getEmoji()                      { return emoji; }
        public void             setEmoji(String emoji)          { this.emoji = emoji; }
        public String           getColorHex()                   { return colorHex; }
        public void             setColorHex(String c)           { this.colorHex = c; }
        public Integer          getOrdre()                      { return ordre; }
        public void             setOrdre(Integer ordre)         { this.ordre = ordre; }
        public List<MatiereDto> getMatieres()                   { return matieres; }
        public void             setMatieres(List<MatiereDto> m) { this.matieres = m; }
    }

    // ════════════════════════════════════════════════════
    //  NiveauSummaryDto  (liste légère sans enfants)
    // ════════════════════════════════════════════════════
    public static class NiveauSummaryDto {
        private Long    id;
        private String  code;
        private String  label;
        private String  fullLabel;
        private String  emoji;
        private String  colorHex;
        private Integer ordre;

        public NiveauSummaryDto() {}

        public NiveauSummaryDto(Long id, String code, String label, String fullLabel,
                                String emoji, String colorHex, Integer ordre) {
            this.id = id; this.code = code; this.label = label;
            this.fullLabel = fullLabel; this.emoji = emoji;
            this.colorHex = colorHex; this.ordre = ordre;
        }

        public Long    getId()                      { return id; }
        public void    setId(Long id)               { this.id = id; }
        public String  getCode()                    { return code; }
        public void    setCode(String code)         { this.code = code; }
        public String  getLabel()                   { return label; }
        public void    setLabel(String label)       { this.label = label; }
        public String  getFullLabel()               { return fullLabel; }
        public void    setFullLabel(String v)       { this.fullLabel = v; }
        public String  getEmoji()                   { return emoji; }
        public void    setEmoji(String emoji)       { this.emoji = emoji; }
        public String  getColorHex()                { return colorHex; }
        public void    setColorHex(String c)        { this.colorHex = c; }
        public Integer getOrdre()                   { return ordre; }
        public void    setOrdre(Integer ordre)      { this.ordre = ordre; }
    }

    // ════════════════════════════════════════════════════
    //  Save*Request — payload POST /api/cours/niveaux/save
    //
    //  Les IDs frontend "_abc123" → Jackson ne peut pas les
    //  désérialiser en Long → arrivent null → nouvelle entité.
    // ════════════════════════════════════════════════════

    public static class SaveSeanceRequest {
        private Long    id;
        private String  titre;
        private String  sousTitre;
        private String  description;
        private String  videoUrl;
        private String  imageUrl;
        private String  duree;
        private String  typeSeance;
        private Boolean disponible;
        private Integer ordre;

        public SaveSeanceRequest() {}

        public Long    getId()                        { return id; }
        public void    setId(Long id)                 { this.id = id; }
        public String  getTitre()                     { return titre; }
        public void    setTitre(String titre)         { this.titre = titre; }
        public String  getSousTitre()                 { return sousTitre; }
        public void    setSousTitre(String s)         { this.sousTitre = s; }
        public String  getDescription()               { return description; }
        public void    setDescription(String d)       { this.description = d; }
        public String  getVideoUrl()                  { return videoUrl; }
        public void    setVideoUrl(String v)          { this.videoUrl = v; }
        public String  getImageUrl()                  { return imageUrl; }
        public void    setImageUrl(String i)          { this.imageUrl = i; }
        public String  getDuree()                     { return duree; }
        public void    setDuree(String d)             { this.duree = d; }
        public String  getTypeSeance()                { return typeSeance; }
        public void    setTypeSeance(String t)        { this.typeSeance = t; }
        public Boolean getDisponible()                { return disponible; }
        public void    setDisponible(Boolean d)       { this.disponible = d; }
        public Integer getOrdre()                     { return ordre; }
        public void    setOrdre(Integer o)            { this.ordre = o; }
    }

    public static class SaveModuleRequest {
        private Long                    id;
        private String                  nom;
        private String                  icon;
        private Integer                 ordre;
        private List<SaveSeanceRequest> seances;

        public SaveModuleRequest() {}

        public Long                    getId()                               { return id; }
        public void                    setId(Long id)                        { this.id = id; }
        public String                  getNom()                              { return nom; }
        public void                    setNom(String nom)                    { this.nom = nom; }
        public String                  getIcon()                             { return icon; }
        public void                    setIcon(String icon)                  { this.icon = icon; }
        public Integer                 getOrdre()                            { return ordre; }
        public void                    setOrdre(Integer o)                   { this.ordre = o; }
        public List<SaveSeanceRequest> getSeances()                          { return seances; }
        public void                    setSeances(List<SaveSeanceRequest> s) { this.seances = s; }
    }

    public static class SaveMatiereRequest {
        private Long                    id;
        private String                  nom;
        private String                  icon;
        private String                  color;
        private String                  description;
        private Integer                 ordre;
        private List<SaveModuleRequest> modules;

        public SaveMatiereRequest() {}

        public Long                    getId()                                { return id; }
        public void                    setId(Long id)                         { this.id = id; }
        public String                  getNom()                               { return nom; }
        public void                    setNom(String nom)                     { this.nom = nom; }
        public String                  getIcon()                              { return icon; }
        public void                    setIcon(String icon)                   { this.icon = icon; }
        public String                  getColor()                             { return color; }
        public void                    setColor(String color)                 { this.color = color; }
        public String                  getDescription()                       { return description; }
        public void                    setDescription(String d)               { this.description = d; }
        public Integer                 getOrdre()                             { return ordre; }
        public void                    setOrdre(Integer o)                    { this.ordre = o; }
        public List<SaveModuleRequest> getModules()                           { return modules; }
        public void                    setModules(List<SaveModuleRequest> m)  { this.modules = m; }
    }

    public static class SaveNiveauRequest {
        private Long                     id;
        private String                   code;
        private String                   label;
        private String                   fullLabel;
        private String                   emoji;
        private String                   colorHex;
        private Integer                  ordre;
        private List<SaveMatiereRequest> matieres;

        public SaveNiveauRequest() {}

        public Long                     getId()                                 { return id; }
        public void                     setId(Long id)                          { this.id = id; }
        public String                   getCode()                               { return code; }
        public void                     setCode(String code)                    { this.code = code; }
        public String                   getLabel()                              { return label; }
        public void                     setLabel(String label)                  { this.label = label; }
        public String                   getFullLabel()                          { return fullLabel; }
        public void                     setFullLabel(String v)                  { this.fullLabel = v; }
        public String                   getEmoji()                              { return emoji; }
        public void                     setEmoji(String emoji)                  { this.emoji = emoji; }
        public String                   getColorHex()                           { return colorHex; }
        public void                     setColorHex(String c)                   { this.colorHex = c; }
        public Integer                  getOrdre()                              { return ordre; }
        public void                     setOrdre(Integer o)                     { this.ordre = o; }
        public List<SaveMatiereRequest> getMatieres()                           { return matieres; }
        public void                     setMatieres(List<SaveMatiereRequest> m) { this.matieres = m; }
    }

    // ════════════════════════════════════════════════════
    //  ApiResponse<T>
    // ════════════════════════════════════════════════════
    public static class ApiResponse<T> {
        private boolean success;
        private String  message;
        private T       data;

        public ApiResponse() {}

        public ApiResponse(boolean success, String message, T data) {
            this.success = success; this.message = message; this.data = data;
        }

        public static <T> ApiResponse<T> ok(T data)            { return new ApiResponse<>(true,  null,    data); }
        public static <T> ApiResponse<T> error(String message) { return new ApiResponse<>(false, message, null); }

        public boolean isSuccess()            { return success; }
        public void    setSuccess(boolean s)  { this.success = s; }
        public String  getMessage()           { return message; }
        public void    setMessage(String msg) { this.message = msg; }
        public T       getData()              { return data; }
        public void    setData(T data)        { this.data = data; }
    }
}