export interface SampleMessage {
  title: string;
  message: string;
}

/**
 * An unencrypted starter message, followed by the two sample ciphertexts
 * from the original widget, unchanged. The ciphertexts are both plain
 * Caesar shifts (ROT13-family), so either the shift or the free
 * substitution controls can decode them.
 */
export const DEFAULT_MESSAGES: readonly SampleMessage[] = [
  {
    title: 'Unencrypted Sample',
    message:
      "A substitution cipher hides a message by swapping every letter for another one, always the same replacement throughout. It never adds or removes letters, so the pattern of how often each letter shows up carries straight through to the disguised version. That is the flaw a codebreaker can exploit: count how often each symbol appears in the secret message, compare those counts to how often each letter tends to appear in ordinary writing, and the most frequent symbol is probably standing in for the most frequent letter. Try shifting this very sentence with the Caesar tab below, or drag letters onto the ciphertext columns to test your own guesses against a scrambled message.",
  },
  {
    title: 'Sample Message (easy)',
    message:
      "Srryvat zl jnl guebhtu gur qnexarff. Thvqrq ol n orngvat urneg. V pna'g gryy jurer gur wbhearl jvyy raq. Ohg V xabj jurer gb fgneg. Gurl gryy zr V'z gbb lbhat gb haqrefgnaq. Gurl fnl V'z pnhtug hc va n qernz. Jryy yvsr jvyy cnff zr ol vs V qba'g bcra hc zl rlrf. Jryy gung'f svar ol zr. Fb jnxr zr hc jura vg'f nyy bire. Jura V'z jvfre naq V'z byqre. Nyy guvf gvzr V jnf svaqvat zlfrys. Naq V qvqa'g xabj V jnf ybfg. Fb jnxr zr hc jura vg'f nyy bire. Jura V'z jvfre naq V'z byqre. Nyy guvf gvzr V jnf svaqvat zlfrys. Naq V qvqa'g xabj V jnf ybfg. V gevrq pneelvat gur jrvtug bs gur jbeyq. Ohg V bayl unir gjb unaqf. Ubcr V trg gur punapr gb geniry gur jbeyq. Ohg V qba'g unir nal cynaf. Jvfu gung V pbhyq fgnl sberire guvf lbhat. Abg nsenvq gb pybfr zl rlrf. Yvsr'f n tnzr znqr sbe rirelbar. Naq ybir vf gur cevmr. Fb jnxr zr hc jura vg'f nyy bire Jura V'z jvfre naq V'z byqre. Nyy guvf gvzr V jnf svaqvat zlfrys Naq V qvqa'g xabj V jnf ybfg. Fb jnxr zr hc jura vg'f nyy bire. Jura V'z jvfre naq V'z byqre. Nyy guvf gvzr V jnf svaqvat zlfrys. Naq V qvqa'g xabj V jnf ybfg.",
  },
  {
    title: 'Sample Message (hard)',
    message:
      "Npd ulk vy krg lycrpdkgj epctopkgda un krg lynparvuypebg gyj un krg ogakgdy aqvdpb pds un krg Mpbpfi bvga p aspbb lydgmpdjgj igbbuo aly. Udevkvym krva pk p jvakpycg un dulmrbi yvygki-kou svbbvuy svbga va py lkkgdbi vyavmyvnvcpyk bvkkbg eblg mdggy qbpygk oruag pqg-jgacgyjgj bvng nudsa pdg au pspzvymbi qdvsvkvwg krpk krgi akvbb krvyt jvmvkpb opkcrga pdg p qdgkki ygpk vjgp. Krva qbpygk rpa - ud dpkrgd rpj - p qduebgs, orvcr opa krva: suak un krg qguqbg uy vk ogdg lyrpqqi nud qdgkki slcr un krg kvsg. Spyi aublkvuya ogdg almmgakgj nud krva qduebgs, elk suak un krgag ogdg bpdmgbi cuycgdygj ovkr krg suwgsgyka un aspbb mdggy qvgcga un qpqgd, orvcr va ujj egcplag uy krg orubg vk opay'k krg aspbb mdggy qvgcga un qpqgd krpk ogdg lyrpqqi. Pyj au krg qduebgs dgspvygj; buka un krg qguqbg ogdg sgpy, pyj suak un krgs ogdg svagdpebg, gwgy krg uyga ovkr jvmvkpb opkcrga. Spyi ogdg vycdgpavymbi un krg uqvyvuy krpk krgi'j pbb spjg p evm svakptg vy cusvym juoy ndus krg kdgga vy krg nvdak qbpcg. Pyj ausg apvj krpk gwgy krg kdgga rpj eggy p epj suwg, pyj krpk yu uyg arulbj gwgd rpwg bgnk krg ucgpya. Pyj krgy, uyg Krldajpi, ygpdbi kou krulapyj igpda pnkgd uyg spy rpj eggy ypvbgj ku p kdgg nud apivym ruo mdgpk vk oulbj eg ku eg yvcg ku qguqbg nud p crpymg, uyg mvdb avkkvym uy rgd uoy vy p aspbb cpng vy Dvctspyaoudkr aljjgybi dgpbvzgj orpk vk opa krpk rpj eggy muvym oduym pbb krva kvsg, pyj arg nvypbbi tygo ruo krg oudbj culbj eg spjg p muuj pyj rpqqi qbpcg. Krva kvsg vk opa dvmrk, vk oulbj oudt, pyj yu uyg oulbj rpwg ku mgk ypvbgj ku pyikrvym. Apjbi, ruogwgd, egnudg arg culbj mgk ku p qruyg ku kgbb pyiuyg peulk vk, p kgddvebg aklqvj cpkpakduqrg ucclddgj, pyj krg vjgp opa buak nudgwgd. Krva va yuk rgd akudi. Elk vk va krg akudi un krpk kgddvebg aklqvj cpkpakduqrg pyj ausg un vka cuyagxlgycga. Vk va pbau krg akudi un p euut, p euut cpbbgj Krg Rvkcr Rvtgd'a Mlvjg ku krg Mpbpfi - yuk py Gpdkr euut, ygwgd qlebvargj uy Gpdkr, pyj lykvb krg kgddvebg cpkpakduqrg ucclddgj, ygwgd aggy ud rgpdj un ei pyi Gpdkrspy. Ygwgdkrgbgaa, p orubbi dgspdtpebg euut.",
  },
];
