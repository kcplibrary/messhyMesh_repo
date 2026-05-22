/**
 * Generates an APA 7th Edition citation for a file.
 * Fixes: Name-to-Initial parsing, Sentence Case, Proper Noun Protection.
 */
export const generateAPA7 = (file) => {
  if (!file) return "";

  // 1. Handle Author (e.g., "ROSE ANN P. BINWIHAN" -> "Binwihan, R. A. P.")
  let authorRaw = file.paper_author || file.uploaded_by || "Unknown Author";
  let formattedAuthor = authorRaw;

  // Split by comma to check for multiple authors
  const authorsList = authorRaw.split(',').map(s => s.trim());
  
  if (authorsList.length > 0) {
    const firstAuthor = authorsList[0]; 
    const nameParts = firstAuthor.split(' ');
    
    // Extract Last Name (last word) and Initials (rest)
    const lastName = nameParts.pop() || ""; 
    const initials = nameParts
      .filter(part => part.length > 0)
      .map(part => part.charAt(0).toUpperCase() + ".")
      .join(" ");

    // Format: Lastname, I. I.
    formattedAuthor = `${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}, ${initials}`;
    
    // APA 7: et al. for 3+ authors. If 2 authors, use "&"
    if (authorsList.length >= 3) {
      formattedAuthor += " et al.";
    } else if (authorsList.length === 2) {
      formattedAuthor += ` & ${authorsList[1]}`;
    }
  }

  // 2. Handle Year
  const year = file.paper_year || "n.d."; 

  // 3. Handle Title (Sentence Case + Protect Proper Nouns)
  let rawTitle = file.paper_title;
  if (!rawTitle && file.filename) {
    rawTitle = file.filename.replace(/\.[^/.]+$/, "").split('_').pop().replace(/-/g, ' ');
  }
  rawTitle = rawTitle || "Untitled";

  // Convert to Sentence case
  let displayTitle = rawTitle.toLowerCase();
  displayTitle = displayTitle.charAt(0).toUpperCase() + displayTitle.slice(1);

  // Protect Proper Nouns (Expand this list as needed)
  const properNouns = ["Benguet", "Philippines", "Baguio", "Cordillera", "Restaurants"];
  properNouns.forEach(noun => {
    const regex = new RegExp(`\\b${noun}\\b`, "gi");
    displayTitle = displayTitle.replace(regex, noun);
  });

  // 4. URL (Strict APA 7: No "Retrieved from", no trailing period)
  const backendUrl = "http://localhost:8000";
  const citation = `${formattedAuthor.trim()} (${year}). ${displayTitle}. ${backendUrl}/uploads/${file.filename}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(citation);
  }
  
  return citation;
};