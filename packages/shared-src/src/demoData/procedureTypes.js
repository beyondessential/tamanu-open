import { splitIds } from './utilities';

const buildProcedure = ({ _id, name: nameAndCode }) => {
  const [code, name] = nameAndCode.split(/\t/);
  return { _id, name, code };
};
export const PROCEDURE_TYPES = splitIds(`
  34830	Open repair of infrarenal aortic aneurysm or dissection, plus repair of associated arterial trauma, following unsuccessful endovascular repair; tube prosthesis
  34831	Open repair of infrarenal aortic aneurysm or dissection, plus repair of associated arterial trauma, following unsuccessful endovascular repair; aorto-bi-iliac prosthesis
  34832	Open repair of infrarenal aortic aneurysm or dissection, plus repair of associated arterial trauma, following unsuccessful endovascular repair; aorto-bifemoral prosthesis
  35081	Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for aneurysm, pseudoaneurysm, and associated occlusive disease, abdominal aorta
  35082	Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for ruptured aneurysm, abdominal aorta
  35091	Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for aneurysm, pseudoaneurysm, and associated occlusive disease, abdominal aorta involving visceral vessels (mesenteric, celiac, renal)
  35092	Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for ruptured aneurysm, abdominal aorta involving visceral vessels (mesenteric, celiac, renal)
  35102	Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for aneurysm, pseudoaneurysm, and associated occlusive disease, abdominal aorta involving iliac vessels (common, hypogastric, external)
  35103	Direct repair of aneurysm, pseudoaneurysm, or excision (partial or total) and graft insertion, with or without patch graft; for ruptured aneurysm, abdominal aorta involving iliac vessels (common, hypogastric, external)
  23900	Interthoracoscapular amputation (forequarter)
  23920	Disarticulation of shoulder
  24900	Amputation, arm through humerus; with primary closure
  24920	Amputation, arm through humerus; open, circular (guillotine)
  24930	Amputation, arm through humerus; re-amputation
  24931	Amputation, arm through humerus; with implant
  25900	Amputation, forearm, through radius and ulna
  25905	Amputation, forearm, through radius and ulna; open, circular (guillotine)
  25909	Amputation, forearm, through radius and ulna; re-amputation
  25920	Disarticulation through wrist
  25922	Disarticulation through wrist; secondary closure or scar revision
  25924	Disarticulation through wrist; re-amputation
  25927	Transmetacarpal amputation;
  25929	Transmetacarpal amputation; secondary closure or scar revision
  25931	Transmetacarpal amputation; re-amputation
  26235	Partial excision (craterization, saucerization, or diaphysectomy) bone (eg, osteomyelitis); proximal or middle phalanx of finger
  26236	Partial excision (craterization, saucerization, or diaphysectomy) bone (eg, osteomyelitis); distal phalanx of finger
  26551	Transfer, toe-to-hand with microvascular anastomosis; great toe wrap-around with bone graft
  26910	Amputation, metacarpal, with finger or thumb (ray amputation), single, with or without interosseous transfer
  26951	Amputation, finger or thumb, primary or secondary, any joint or phalanx, single, including neurectomies; with direct closure
  26952	Amputation, finger or thumb, primary or secondary, any joint or phalanx, single, including neurectomies; with local advancement flaps (V-Y, hood)
  27290	Interpelviabdominal amputation (hindquarter amputation)
  27295	Disarticulation of hip
  27590	Amputation, thigh, through femur, any level;
  27591	Amputation, thigh, through femur, any level; immediate fitting technique including first cast
  27592	Amputation, thigh, through femur, any level; open, circular (guillotine)
  27598	Disarticulation at knee
  27880	Amputation, leg, through tibia and fibula;
  27882	Amputation, leg, through tibia and fibula; open, circular (guillotine)
  27884	Amputation, leg, through tibia and fibula; secondary closure or scar revision
  27886	Amputation, leg, through tibia and fibula; re-amputation
  27888	Amputation, ankle, through malleoli of tibia and fibula (e.g., Syme, Pirogoff type procedures), with plastic closure and resection of nerves
  27889	Ankle disarticulation
  28124	Partial excision (craterization, saucerization, sequestrectomy, or diaphysectomy) bone (eg, osteomyelitis or bossing); phalanx of toe
  28126	Resection, partial or complete, phalangeal base, each toe
  28160	Hemiphalangectomy or interphalangeal joint excision, toe, proximal end of phalanx, each
  28800	Amputation, foot; midtarsal (e.g., Chopart type procedure)
  28805	Amputation, foot; transmetatarsal
  28810	Amputation, metatarsal, with toe, single
  28820	Amputation, toe; metatarsophalangeal joint
  28825	Amputation, toe; interphalangeal joint
  44900	Incision and drainage of appendiceal abscess; open
  44950	Appendectomy
  44955	Appendectomy; when done for indicated purpose at time of other major procedure (not as separate procedure) (List separately in addition to code for primary procedure)
  44960	Appendectomy; for ruptured appendix with abscess or generalized peritonitis
  44970	Laparoscopy, surgical, appendectomy
  44979	Unlisted laparoscopy procedure, appendix
  36800	Insertion of cannula for hemodialysis, other purpose (separate procedure); vein to vein
  36810	Insertion of cannula for hemodialysis, other purpose (separate procedure); arteriovenous, external (Scribner type)
  36815	Insertion of cannula for hemodialysis, other purpose (separate procedure); arteriovenous, external revision, or closure
  36818	Arteriovenous anastomosis, open; by upper arm cephalic vein transposition
  36819	Arteriovenous anastomosis, open; by upper arm basilic vein transposition
  36820	Arteriovenous anastomosis, open; by forearm vein transposition
  36821	Arteriovenous anastomosis, open; direct, any site (e.g., Cimino type) (separate procedure)
  36825	Creation of arteriovenous fistula by other than direct arteriovenous anastomosis (separate procedure); autogenous graft
  36830	Creation of arteriovenous fistula by other than direct arteriovenous anastomosis (separate procedure); non autogenous graft
  36832	Revision, open, arteriovenous fistula; without thrombectomy, autogenous or nonautogenous dialysis graft (separate procedure)
  36833	Revision, open, arteriovenous fistula; with thrombectomy, autogenous or nonautogenous dialysis graft (separate procedure)
  36838	Distal revascularization and interval ligation (DRIL), upper extremity hemodialysis access (steal syndrome)
  47010	Hepatotomy; for open drainage of abscess or cyst, 1 or 2 stages
  47015	Laparotomy, with aspiration and/or injection of hepatic parasitic (eg, amoebic or echinococcal) cyst(s) or abscess(es
  47100	Biopsy of liver, wedge
  47120	Hepatectomy, resection of liver; partial lobectomy
  47122	Hepatectomy, resection of liver; trisegmentectomy
  47125	Hepatectomy, resection of liver; total left lobectomy
  47130	Hepatectomy, resection of liver; total right lobectomy
  47140	Donor hepatectomy (including cold preservation), from living donor; left lateral segment only (segments II and III)
  47141	Donor hepatectomy (including cold preservation), from living donor; total left lobectomy (segments II, III and IV)
  47142	Donor hepatectomy (including cold preservation), from living donor; total right lobectomy (segments V, VI, VII and VIII)
  47300	Marsupialization of cyst or abscess of liver
  47350	Management of liver hemorrhage; simple suture of liver wound or injury
  47360	Management of liver hemorrhage; complex suture of liver wound or injury, with or without hepatic artery ligatio
  47361	Management of liver hemorrhage; exploration of hepatic wound, extensive debridement, coagulation and/or suture, with or without packing of liver
  47362	Management of liver hemorrhage; re-exploration of hepatic wound for removal of packing
  47370	Laparoscopy, surgical, ablation of 1 or more liver tumor(s); radiofrequency
  47371	Laparoscopy, surgical, ablation of 1 or more liver tumor(s); cryosurgical
  47379	Unlisted laparoscopic procedure, liver
  47380	Ablation, open, of 1 or more liver tumor(s); radiofrequency
  47381	Ablation, open, of 1 or more liver tumor(s); cryosurgical
  47400	Hepaticotomy or hepaticostomy with exploration, drainage, or removal of calculus
  47420	Choledochotomy or choledochostomy with exploration, drainage, or removal of calculus, with or without cholecystotomy; without transduodenal sphincterotomy or sphincteroplasty
  47425	Choledochotomy or choledochostomy with exploration, drainage, or removal of calculus, with or without cholecystotomy; with transduodenal sphincterotomy or sphincteroplasty
  47460	Transduodenal sphincterotomy or sphincteroplasty, with or without transduodenal extraction of calculus (separate procedure)
  47700	Exploration for congenital atresia of bile ducts, without repair, with or without liver biopsy, with or without cholangiography
  47701	Portoenterostomy (eg, Kasai procedure)
  47711	Excision of bile duct tumor, with or without primary repair of bile duct; extrahepatic
  47712	Excision of bile duct tumor, with or without primary repair of bile duct; intrahepatic
  47715	Excision of choledochal cyst
  47760	Anastomosis, of extrahepatic biliary ducts and gastrointestinal tract
  47765	Anastomosis, of intrahepatic ducts and gastrointestinal tract
  47780	Anastomosis, Roux-en-Y, of extrahepatic biliary ducts and gastrointestinal tract
  47785	Anastomosis, Roux-en-Y, of intrahepatic biliary ducts and gastrointestinal tract
  47800	Reconstruction, plastic, of extrahepatic biliary ducts with end-to-end anastomosis
  47802	U-tube hepaticoenterostomy
  47900	Suture of extrahepatic biliary duct for pre-existing injury (separate procedure)
  48000	Placement of drains, peripancreatic, for acute pancreatitis;
  48001	Placement of drains, peripancreatic, for acute pancreatitis; with cholecystostomy, gastrostomy, and jejunostomy
  48020	Removal of pancreatic calculus
  48100	Biopsy of pancreas, open (eg, fine needle aspiration, needle core biopsy, wedge biopsy)
  48105	Resection or debridement of pancreas and peripancreatic tissue for acute necrotizing pancreatitis
  48120	Excision of lesion of pancreas (eg, cyst, adenoma)
  48140	Pancreatectomy, distal subtotal, with or without splenectomy; without pancreaticojejunostomy
  48145	Pancreatectomy, distal subtotal, with or without splenectomy; with pancreaticojejunostomy
  48146	Pancreatectomy, distal, near-total with preservation of duodenum (Child-type procedure)
  48148	Excision of ampulla of Vater
  48150	Pancreatectomy, proximal subtotal with total duodenectomy, partial gastrectomy, choledochoenterostomy and gastrojejunostomy (Whipple-type procedure); with pancreatojejunostomy
  48152	Pancreatectomy, proximal subtotal with total duodenectomy, partial gastrectomy, choledochoenterostomy and gastrojejunostomy (Whipple-type procedure); without pancreatojejunostomy
  48153	Pancreatectomy, proximal subtotal with near-total duodenectomy, choledochoenterostomy and duodenojejunostomy (pylorus-sparing, Whipple-type procedure); with pancreatojejunostomy
  48154	Pancreatectomy, proximal subtotal with near-total duodenectomy, choledochoenterostomy and duodenojejunostomy (pylorus-sparing, Whipple-type procedure); without pancreatojejunostomy
  48155	Pancreatectomy, total
  48160	Pancreatectomy, total or subtotal, with autologous transplantation of pancreas or pancreatic islet cells
  48500	Marsupialization of pancreatic cyst
  48510	External drainage, pseudocyst of pancreas; open
  48520	Internal anastomosis of pancreatic cyst to gastrointestinal tract; direct
  48540	Internal anastomosis of pancreatic cyst to gastrointestinal tract; Roux-en-Y
  48545	Pancreatorrhaphy for injury
  48548	Pancreaticojejunostomy, side-to-side anastomosis (Puestow-type operation)
  11970	Removal of tissue expander(s) without insertion of prosthesis removal of tissue expander(s) with insertion of prosthesis
  19101	Biopsy of breast; open, incisional
  19105	Ablation, cryosurgical, of fibroadenoma, including ultrasound guidance, each fibroadenoma
  19110	Nipple exploration, with or without excision of a solitary lactiferous duct or a papilloma lactiferous duct
  19112	Excision of lactiferous duct fistula
  19120	Excision of cyst, fibroadenoma, or other benign or malignant tumor, aberrant breast tissue, duct lesion, nipple or areolar lesion (except 19300), open, male or female, 1 or more lesions
  19125	Excision of breast lesion identified by pre-operative placement of radiological marker, open, single lesion
  19126	Excision of breast lesion identified by pre-operative placement of radiological marker, open, single lesion; each additional lesion separately identified by a preoperative radiological marker (list separately in addition to code for primary procedures) excision of breast lesion identified by pre-operative placement of radiological marker, open, single lesion
  19300	Mastectomy for gynecomastia
  19301	Mastectomy, partial (eg, lumpectomy, tylectomy, quadrantectomy, segmentectomy);
  19302	Mastectomy, partial (eg, lumpectomy, tylectomy, quadrantectomy, segmentectomy); with axillary lymphadenectomy
  19303	Mastectomy, simple, complete
  19304	Mastectomy, subcutaneous
  19305	Mastectomy, radical, including pectoral muscles, axillary lymph nodes
  19306	Mastectomy, radical, including pectoral muscles, axillary and internal mammary lymph nodes (Urban type operation)
  19307	Mastectomy, modified radical, including axillary lymph nodes, with or without pectoralis minor muscle, but excluding pectoralis major muscle
  19316	Mastopexy
  19318	Reduction mammaplasty
  19324	Mammaplasty, augmentation; without prosthetic implant
  19325	Mammaplasty, augmentation; with prosthetic implant
  19328	Removal of intact mammary implant
  19330	Removal of mammary implant material
  19340	Immediate insertion of breast prosthesis following mastopexy, mastectomy or in reconstruction
  19342	Delayed insertion of breast prosthesis following mastopexy, mastectomy or in reconstruction
  19350	Nipple/areola reconstruction
  19355	Correction of inverted nipples
  19357	Breast reconstruction, immediate or delayed, with tissue expander, including subsequent expansion
  19361	Breast reconstruction with latissimus dorsi flap, without prosthetic implant
  19364	Breast reconstruction with free flap
  19366	Breast reconstruction with other technique
  19367	Breast reconstruction with transverse rectus abdominis myocutaneous flap (TRAM), single pedicle, including closure of donor site;
  19368	Breast reconstruction with transverse rectus abdominis myocutaneous flap (TRAM), single pedicle, including closure of donor site; with microvascular anastomosis (supercharging)
  19369	Breast reconstruction with transverse rectus abdominis myocutaneous flap (TRAM), double pedicle, including closure of donor site
  19370	Open periprosthetic capsulotomy, breast
  19371	Periprosthetic capsulectomy, breast
  19380	Revision of reconstructed breast
  32658	Thoracoscopy, surgical; with removal of clot or foreign body from pericardial sac
  32659	Thoracoscopy, surgical; with creation of pericardial window or partial resection of pericardial sac for drainage
  32661	Thoracoscopy, surgical; with excision of pericardial cyst, tumor, or mass
  33020	Pericardiotomy for removal of clot or foreign body (primary procedure)
  33025	Creation of pericardial window or partial resection for drainage
  33030	Pericardiectomy, subtotal or complete; without cardiopulmonary bypass
  33031	Pericardiectomy, subtotal or complete; with cardiopulmonary bypass
  33050	Resection of pericardial cyst or tumor
  33120	Excision of intracardiac tumor, resection with cardiopulmonary bypass
  33130	Resection of external cardiac tumor
  33250	Operative ablation of supraventricular arrhythmogenic focus or pathway (eg, Wolff-Parkinson-White, atrioventricular node re-entry), tract(s) and/or focus (foci); without cardiopulmonary bypass
  33251	Operative ablation of supraventricular arrhythmogenic focus or pathway (eg, Wolff-Parkinson-White, atrioventricular node re-entry), tract(s) and/or focus (foci); with cardiopulmonary bypass
  33254	Operative tissue ablation and reconstruction of atria, limited (eg, modified maze procedure)
  33255	Operative tissue ablation and reconstruction of atria, extensive (eg, maze procedure); without cardiopulmonary bypass
  33256	Operative tissue ablation and reconstruction of atria, extensive (eg, maze procedure); with cardiopulmonary bypass
  33257	Operative tissue ablation and reconstruction of atria, performed at the time of other cardiac procedure(s), limited (eg, modified maze procedure) (List separately in addition to code for primary procedure)
  33258	Operative tissue ablation and reconstruction of atria, performed at the time of other cardiac procedure(s), extensive (eg, maze procedure), without cardiopulmonary bypass (List separately in addition to code for primary procedure)
  33259	Operative tissue ablation and reconstruction of atria, performed at the time of other cardiac procedure(s), extensive (eg, maze procedure), with cardiopulmonary bypass (List separately in addition to code for primary procedure)
  33261	Operative ablation of ventricular arrhythmogenic focus with cardiopulmonary bypass
  33265	Endoscopy, surgical; operative tissue ablation and reconstruction of atria, limited (eg, modified maze procedure), without cardiopulmonary bypass
  33266	Endoscopy, surgical; operative tissue ablation and reconstruction of atria, extensive (eg, maze procedure), without cardiopulmonary bypass
  33300	Repair of cardiac wound; without bypass
  33305	Repair of cardiac wound; with cardiopulmonary bypass
  33310	Cardiotomy, exploratory (includes removal of foreign body, atrial or ventricular thrombus); without bypass
  33315	Cardiotomy, exploratory (includes removal of foreign body, atrial or ventricular thrombus); with cardiopulmonary bypass
  33365	Transcatheter aortic valve replacement (TAVR/TAVI) with prosthetic valve; transaortic approach (eg, median sternotomy, mediastinotomy)
  33366	Transcatheter aortic valve replacement (TAVR/TAVI) with prosthetic valve; transapical exposure (eg, left thoracotomy)
  33390	Valvuloplasty, aortic valve, open, with cardiopulmonary bypass; simple (ie, valvotomy, debridement, debulking, and/or simple commissural resuspension)
  33391	Valvuloplasty, aortic valve, open, with cardiopulmonary bypass; complex (eg, leaflet extension, leaflet resection, leaflet reconstruction, or annuloplasty)
  33404	Construction of apical-aortic conduit
  33405	Replacement, aortic valve, open, with cardiopulmonary bypass; with prosthetic valve other than homograft or stentless valve
  33406	Replacement, aortic valve, with cardiopulmonary bypass; with allograft valve (freehand)
  33410	Replacement, aortic valve, open, with cardiopulmonary bypass; with stentless tissue valve
  33411	Replacement, aortic valve; with aortic annulus enlargement, noncoronary sinus
  33412	Replacement, aortic valve; with transventricular aortic annulus enlargement (Konno procedure)
  33413	Replacement, aortic valve; by translocation of autologous pulmonary valve with allograft replacement of pulmonary valve (Ross procedure)
  33414	Repair of left ventricular outflow tract obstruction by patch enlargement of the outflow tract
  33415	Resection or incision of subvalvular tissue for discrete subvalvular aortic stenosis
  33416	Ventriculomyotomy (-myectomy) for idiopathic hypertrophic subaortic stenosis (eg, asymmetric septal hypertrophy)
  33417	Aortoplasty (gusset) for supravalvular stenosis
  33420	Valvotomy, mitral valve; closed heart
  33422	Valvotomy, mitral valve; open heart, with cardiopulmonary bypass
  33425	Valvuloplasty, mitral valve, with cardiopulmonary bypass;
  33426	Valvuloplasty, mitral valve, with cardiopulmonary bypass; with prosthetic ring
  33427	Valvuloplasty, mitral valve, with cardiopulmonary bypass; radical reconstruction, with or without ring
  33430	Replacement, mitral valve, with cardiopulmonary bypass
  33440	Replacement of aortic valve by translocation of autologous pulmonary valve and transventricular aortic annulus enlargement of left ventricular outflow tract with valved conduit replacement of pulmonary valve
  33460	Valvectomy, tricuspid valve, with cardiopulmonary bypass
  33463	Valvuloplasty, tricuspid valve; without ring insertion
  33464	Valvuloplasty, tricuspid valve; with ring insertion
  33465	Replacement, tricuspid valve, with cardiopulmonary bypass
  33468	Tricuspid valve repositioning and plication for Ebstein anomaly
  33470	Valvotomy, pulmonary valve, closed heart; transventricular
  33471	Valvotomy, pulmonary valve, closed heart; via pulmonary artery
  33474	Valvotomy, pulmonary valve, open heart, with cardiopulmonary bypass
  33475	Replacement, pulmonary valve
  33476	Right ventricular resection for infundibular stenosis, with or without commissurotomy
  33478	Outflow tract augmentation (gusset), with or without commissurotomy or infundibular resection
  33496	Repair of non-structural prosthetic valve dysfunction with cardiopulmonary bypass (separate procedure)
  33542	Myocardial resection (eg, ventricular aneurysmectomy)
  33545	Repair of postinfarction ventricular septal defect, with or without myocardial resection
  33548	Surgical ventricular restoration procedure, includes prosthetic patch, when performed (eg, ventricular remodeling, SVR, SAVER, Dor procedures)
  33600	Closure of atrioventricular valve (mitral or tricuspid) by suture or patch
  33602	Closure of semilunar valve (aortic or pulmonary) by suture or patch
  33608	Repair of complex cardiac anomaly other than pulmonary atresia with ventricular septal defect by construction or replacement of conduit from right or left ventricle to pulmonary artery
  33610	Repair of complex cardiac anomalies (eg, single ventricle with subaortic obstruction) by surgical enlargement of ventricular septal defect
  33611	Repair of double outlet right ventricle with intraventricular tunnel repair;
  33612	Repair of double outlet right ventricle with intraventricular tunnel repair; with repair of right ventricular outflow tract obstruction
  33615	Repair of complex cardiac anomalies (eg, tricuspid atresia) by closure of atrial septal defect and anastomosis of atria or vena cava to pulmonary artery (simple Fontan procedure)
  33617	Repair of complex cardiac anomalies (e.g., single ventricle by modified Fontan)
  33619	Repair of single ventricle with aortic outflow obstruction and aortic arch hypoplasia (hypoplastic left heart syndrome) (eg, Norwood procedure)
  33641	Repair atrial septal defect, secundum, with cardiopulmonary bypass, with or without patch
  33645	Direct or patch closure, sinus venosus, with or without anomalous pulmonary venous drainage
  33647	Repair of atrial septal defect and ventricular septal defect, with direct or patch closure
  33660	Repair of incomplete or partial atrioventricular canal (ostium primum atrial septal defect), with or without atrioventricular valve repair
  33665	Repair of intermediate or transitional atrioventricular canal, with or without atrioventricular valve repair
  33670	Repair of complete atrioventricular canal, with or without prosthetic valve
  33675	Closure of multiple ventricular septal defects;
  33676	Closure of multiple ventricular septal defects; with pulmonary valvotomy or infundibular resection (acyanotic)
  33677	Closure of multiple ventricular septal defects; with removal of pulmonary artery band, with or without gusset
  33681	Closure of single ventricular septal defect, with or without patch;
  33684	Closure of single ventricular septal defect, with or without patch; with pulmonary valvotomy or infundibular resection (acyanotic)
  33688	Closure of single ventricular septal defect, with or without patch; with removal of pulmonary artery band, with or without gusset
  33692	Complete repair tetralogy of Fallot without pulmonary atresia;
  33694	Complete repair tetralogy of Fallot without pulmonary atresia; with transannular patch
  33697	Complete repair tetralogy of Fallot with pulmonary atresia including construction of conduit from right ventricle to pulmonary artery and closure of ventricular septal defect
  33702	Repair sinus of Valsalva fistula, with cardiopulmonary bypass;
  33710	Repair sinus of Valsalva fistula, with cardiopulmonary bypass; with repair of ventricular septal defect
  33720	Repair sinus of Valsalva aneurysm, with cardiopulmonary bypass
  33722	Closure of aortico-left ventricular tunnel
  33732	Repair of cor triatriatum or supravalvular mitral ring by resection of left atrial membrane
  33735	Atrial septectomy or septostomy; closed heart (Blalock-Hanlon type operation)
  33736	Atrial septectomy or septostomy; open heart with cardiopulmonary bypass
  33737	Atrial septectomy or septostomy; open heart, with inflow occlusion
  33770	Repair of transposition of the great arteries with ventricular septal defect and subpulmonary stenosis; without surgical enlargement of ventricular septal defect
  33774	Repair of transposition of the great arteries, atrial baffle procedure (eg, Mustard or Senning type) with cardiopulmonary bypass;
  33776	Repair of transposition of the great arteries, atrial baffle procedure (eg, Mustard or Senning type) with cardiopulmonary bypass; with closure of ventricular septal defect
  33780	Repair of transposition of the great arteries, aortic pulmonary artery reconstruction (eg, Jatene type); with closure of ventricular septal defect
  33782	Aortic root translocation with ventricular septal defect and pulmonary stenosis repair (ie, Nikaidoh procedure); without coronary ostium reimplantation
  33783	Aortic root translocation with ventricular septal defect and pulmonary stenosis repair (ie, Nikaidoh procedure); with reimplantation of 1 or both coronary ostia
  33786	Total repair, truncus arteriosus (Rastelli type operation)
  33813	Obliteration of aortopulmonary septal defect; without cardiopulmonary bypass
  33814	Obliteration of aortopulmonary septal defect; with cardiopulmonary bypass
  33920	Repair of pulmonary atresia with ventricular septal defect, by construction or replacement of conduit from right or left ventricle to pulmonary artery
  33510	Coronary artery bypass, vein only; single coronary venous graft
  33511	Coronary artery bypass, vein only; 2 coronary venous grafts
  33512	Coronary artery bypass, vein only; 3 coronary venous grafts
  33513	Coronary artery bypass, vein only; 4 coronary venous grafts
  33514	Coronary artery bypass, vein only; 5 coronary venous grafts
  33516	Coronary artery bypass, vein only; 6 or more coronary venous grafts
  33533	Coronary artery bypass, using arterial graft(s); single arterial graft
  33534	Coronary artery bypass, using arterial graft(s); 2 coronary arterial grafts
  33535	Coronary artery bypass, using arterial graft(s); 3coronary arterial grafts
  33536	Coronary artery bypass, using arterial graft(s);  4 or moreoronary arterial grafts
  35301	Thromboendarterectomy, including patch graft, if performed; carotid, vertebral, subclavian, by neck incision
  35390	Reoperation, carotid, thromboendarterectomy, more than 1 month after original operation (List separately in addition to code for primary procedure)
  47480	Cholecystotomy or cholecystostomy, open, with exploration, drainage, or removal of calculus (separate procedure)
  47562	Laparoscopy, surgical; cholecystectomy
  47563	Laparoscopy, surgical; cholecystectomy with cholangiography
  47564	Laparoscopy, surgical; cholecystectomy with exploration of common duct
  47570	Laparoscopy, surgical; cholecystoenterostomy
  47600	Cholecystectomy;
  47605	Cholecystectomy; with cholangiography
  47610	Cholecystectomy with exploration of common duct;
  47612	Cholecystectomy with exploration of common duct; with choledochoenterostomy
  47620	Cholecystectomy with exploration of common duct; with transduodenal sphincterotomy or sphincteroplasty, with or without cholangiography
  47720	Cholecystoenterostomy; direct
  47721	Cholecystoenterostomy; with gastroenterostomy
  47740	Cholecystoenterostomy; Roux-en-Y
  47741	Cholecystoenterostomy; Roux-en-Y with gastroenterostomy
  44025	Colotomy, for exploration, biopsy(s), or foreign body removal
  44110	Excision of 1 or more lesions of small or large intestine not requiring anastomosis, exteriorization, or fistulization; single enterotomy
  44111	Excision of 1 or more lesions of small or large intestine not requiring anastomosis, exteriorization, or fistulization; multiple enterotomies
  44137	Removal of transplanted intestinal allograft, complete
  44140	Colectomy, partial; with anastomosis
  44141	Colectomy, partial; with skin level cecostomy or colostomy
  44143	Colectomy, partial; with end colostomy and closure of distal segment (Hartmann type procedure)
  44144	Colectomy, partial; with resection, with colostomy or ileostomy and creation of mucofistula
  44145	Colectomy, partial; with coloproctostomy (low pelvic anastomosis)
  44146	Colectomy, partial; with coloproctostomy (low pelvic anastomosis), with colostomy
  44147	Colectomy, partial; abdominal and transanal approach
  44150	Colectomy, total, abdominal, without proctectomy; with ileostomy or ileoproctostomy
  44151	Colectomy, total, abdominal, without proctectomy; with continent ileostomy
  44155	Colectomy, total, abdominal, with proctectomy; with ileostomy
  44156	Colectomy, total, abdominal, with proctectomy; with continent ileostomy
  44157	Colectomy, total, abdominal, with proctectomy; with ileoanal anastomosis, includes loop ileostomy, and rectal mucosectomy, when performed
  44158	Colectomy, total, abdominal, with proctectomy; with ileoanal anastomosis, creation of ileal reservoir (S or J), includes loop ileostomy, and rectal mucosectomy, when performed
  44160	Colectomy, partial, with removal of terminal ileum with ileocolostomy
  44188	Laparoscopy, surgical, colostomy or skin level cecostomy
  44204	Laparoscopy, surgical; colectomy, partial, with anastomosis
  44205	Laparoscopy, surgical; colectomy, partial, with removal of terminal ileum with ileocolostomy
  44206	Laparoscopy, surgical; colectomy, partial, with end colostomy and closure of distal segment (Hartmann type procedure)
  44207	Laparoscopy, surgical; colectomy, partial, with anastomosis, with coloproctostomy (low pelvic anastomosis)
  44208	Laparoscopy, surgical; colectomy, partial, with anastomosis, with coloproctostomy (low pelvic anastomosis) with colostomy
  44210	Laparoscopy, surgical; colectomy, total, abdominal, without proctectomy, with ileostomy or ileoproctostomy
  44211	Laparoscopy, surgical; colectomy, total, abdominal, with proctectomy, with ileoanal anastomosis, creation of ileal reservoir (S or J), with loop ileostomy, includes rectal mucosectomy, when performed
  44212	Laparoscopy, surgical; colectomy, total, abdominal, with proctectomy, with ileostomy
  44213	Laparoscopy, surgical, mobilization (take-down) of splenic flexure performed in conjunction with partial colectomy (List separately in addition to primary procedure)
  44227	Laparoscopy, surgical, closure of enterostomy, large or small intestine, with resection and anastomosis
  44320	Colostomy or skin level cecostomy;
  44322	Colostomy or skin level cecostomy; with multiple biopsies (eg, for congenital megacolon) (separate procedure)
  44340	Revision of colostomy; simple (release of superficial scar) (separate procedure)
  44345	Revision of colostomy; complicated (reconstruction in-depth) (separate procedure)
  44346	Revision of colostomy; with repair of paracolostomy hernia (separate procedure)
  44604	Suture of large intestine (colorrhaphy) for perforated ulcer, diverticulum, wound, injury or rupture (single or multiple perforations); without colostomy
  44605	Suture of large intestine (colorrhaphy) for perforated ulcer, diverticulum, wound, injury or rupture (single or multiple perforations); with colostomy
  44620	Closure of enterostomy, large or small intestine
  44625	Closure of enterostomy, large or small intestine; with resection and anastomosis other than colorectal
  44626	Closure of enterostomy, large or small intestine; with resection and colorectal anastomosis (eg, closure of Hartmann type procedure)
  61105	Twist drill hole for subdural or ventricular puncture
  61107	Twist drill hole(s) for subdural, intracerebral, or ventricular puncture; for implanting ventricular catheter, pressure recording device, or other intracerebral monitoring device
  61108	Twist drill hole(s) for subdural, intracerebral, or ventricular puncture; for evacuation and/or drainage of subdural hematoma
  61120	Burr hole(s) for ventricular puncture (including injection of gas, contrast media, dye, or radioactive material)
  61140	Burr hole(s) or trephine; with biopsy of brain or intracranial lesion
  61150	Burr hole(s) or trephine; with drainage of brain abscess or cyst
  61151	Burr hole(s) or trephine; with subsequent tapping (aspiration) of intracranial abscess or cyst
  61154	Burr hole(s) with evacuation and/or drainage of hematoma, extradural or subdural
  61156	Burr hole(s); with aspiration of hematoma or cyst, intracerebral
  61210	Burr hole(s); for implanting ventricular catheter, reservoir, EEG electrode(s), pressure recording device, or other cerebral monitoring device (separate procedure)
  61250	Burr hole(s) or trephine, supratentorial, exploratory, not followed by other surgery
  61253	Burr hole(s) or trephine, infratentorial, unilateral or bilateral
  61304	Craniectomy or craniotomy, exploratory; supratentorial
  61305	Craniectomy or craniotomy, exploratory; infratentorial (posterior fossa)
  61312	Craniectomy or craniotomy for evacuation of hematoma, supratentorial; extradural or subdural
  61313	Craniectomy or craniotomy for evacuation of hematoma, supratentorial; intracerebral
  61314	Craniectomy or craniotomy for evacuation of hematoma, infratentorial; extradural or subdural
  61315	Craniectomy or craniotomy for evacuation of hematoma, infratentorial; intracerebellar
  61320	Craniectomy or craniotomy, drainage of intracranial abscess; supratentorial
  61321	Craniectomy or craniotomy, drainage of intracranial abscess; infratentorial
  61322	Craniectomy or craniotomy, decompressive, with or without duraplasty, for treatment of intracranial hypertension, without evacuation of associated intraparenchymal hematoma; without lobectomy
  61323	Craniectomy or craniotomy, decompressive, with or without duraplasty, for treatment of intracranial hypertension, without evacuation of associated intraparenchymal hematoma; with lobectomy
  61330	Decompression of orbit only, transcranial approach
  61333	Exploration of orbit (transcranial approach); with removal of lesion
  61340	Subtemporal cranial decompression (pseudotumor cerebri, slit ventricle syndrome)
  61343	Craniectomy, suboccipital with cervical laminectomy for decompression of medulla and spinal cord, with or without dural graft (eg, Arnold-Chiari malformation)
  61345	Other cranial decompression, posterior fossa
  61458	Craniectomy, suboccipital; for exploration or decompression of cranial nerves
  61460	for section of 1 or more cranial nerves
  61510	Craniectomy, trephination, bone flap craniotomy; for excision of brain tumor, supratentorial, except meningioma
  61512	Craniectomy, trephination, bone flap craniotomy; for excision of meningioma, supratentorial
  61514	Craniectomy, trephination, bone flap craniotomy; for excision of brain abscess, supratentorial
  61516	Craniectomy, trephination, bone flap craniotomy; for excision or fenestration of cyst, supratentorial
  61518	Craniectomy for excision of brain tumor, infratentorial or posterior fossa; except meningioma, cerebellopontine angle tumor, or midline tumor at base of skull
  61519	Craniectomy for excision of brain tumor, infratentorial or posterior fossa; meningioma
  61520	Craniectomy for excision of brain tumor, infratentorial or posterior fossa; cerebellopontine angle tumor
  61521	Craniectomy for excision of brain tumor, infratentorial or posterior fossa; midline tumor at base of skull
  61522	Craniectomy, infratentorial or posterior fossa; for excision of brain abscess
  61524	Craniectomy, infratentorial or posterior fossa; for excision or fenestration of cyst
  61526	Craniectomy, bone flap craniotomy, transtemporal (mastoid) for excision of cerebellopontine angle tumor;
  61530	Craniectomy, bone flap craniotomy, transtemporal (mastoid) for excision of cerebellopontine angle tumor; combined with middle/posterior fossa craniotomy/craniectomy
  61531	Subdural implantation of strip electrodes through 1 or more burr or trephine hole(s) for long-term seizure monitoring
  61533	Craniotomy with elevation of bone flap; for subdural implantation of an electrode array, for long-term seizure monitoring
  61534	Craniotomy with elevation of bone flap; for excision of epileptogenic focus without electrocorticography during surgery
  61535	Craniotomy with elevation of bone flap; for removal of epidural or subdural electrode array, without excision of cerebral tissue (separate procedure)
  61536	Craniotomy with elevation of bone flap; for excision of cerebral epileptogenic focus, with electrocorticography during surgery (includes removal of electrode array)
  61537	Craniotomy with elevation of bone flap; for lobectomy, temporal lobe, without electrocorticography during surgery
  61538	Craniotomy with elevation of bone flap; for lobectomy, temporal lobe, with electrocorticography during surgery
  61539	Craniotomy with elevation of bone flap; for lobectomy, other than temporal lobe, partial or total, with electrocorticography during surgery
  61540	Craniotomy with elevation of bone flap; for lobectomy, other than temporal lobe, partial or total, without electrocorticography during surgery
  61541	Craniotomy with elevation of bone flap; for transection of corpus callosum
  61543	Craniotomy with elevation of bone flap; for partial or subtotal (functional) hemispherectomy
  61544	Craniotomy with elevation of bone flap; for excision or coagulation of choroid plexus
  61545	Craniotomy with elevation of bone flap; for excision of craniopharyngioma
  61546	Craniotomy for hypophysectomy or excision of pituitary tumor, intracranial approach
  61548	Hypophysectomy or excision of pituitary tumor, transnasal or transseptal approach, nonstereotactic
  61566	Craniotomy with elevation of bone flap; for selective amygdalohippocampectomy
  61567	for multiple subpial transections, with electrocorticography during surgery
  61570	Craniectomy or craniotomy; with excision of foreign body from brain
  61571	Craniectomy or craniotomy; with treatment of penetrating wound of brain
  61575	Transoral approach to skull base, brain stem or upper spinal cord for biopsy, decompression or excision of lesion;
  61576	Transoral approach to skull base, brain stem or upper spinal cord for biopsy, decompression or excision of lesion; requiring splitting of tongue and/or mandible (including tracheostomy)
  61580	Craniofacial approach to anterior cranial fossa; extradural, including lateral rhinotomy, ethmoidectomy, sphenoidectomy, without maxillectomy or orbital exenteration
  61581	Craniofacial approach to anterior cranial fossa; extradural, including lateral rhinotomy, orbital exenteration, ethmoidectomy, sphenoidectomy and/or maxillectomy
  61582	Craniofacial approach to anterior cranial fossa; extradural, including unilateral or bifrontal craniotomy, elevation of frontal lobe(s), osteotomy of base of anterior cranial fossa
  61583	Craniofacial approach to anterior cranial fossa; intradural, including unilateral or bifrontal craniotomy, elevation or resection of frontal lobe, osteotomy of base of anterior cranial fossa
  61584	Orbitocranial approach to anterior cranial fossa, extradural, including supraorbital ridge osteotomy and elevation of frontal and/or temporal lobe(s); without orbital exenteration
  61585	Orbitocranial approach to anterior cranial fossa, extradural, including supraorbital ridge osteotomy and elevation of frontal and/or temporal lobe(s); with orbital exenteration
  61586	Bicoronal, transzygomatic and/or LeFort I osteotomy approach to anterior cranial fossa with or without internal fixation, without bone graft
  61590	Infratemporal pre-auricular approach to middle cranial fossa (parapharyngeal space, infratemporal and midline skull base, nasopharynx), with or without disarticulation of the mandible, including parotidectomy, craniotomy, decompression and/or mobilization
  61591	Infratemporal post-auricular approach to middle cranial fossa (internal auditory meatus, petrous apex, tentorium, cavernous sinus, parasellar area, infratemporal fossa) including mastoidectomy, resection of sigmoid sinus, with or without decompression and
  61592	Orbitocranial zygomatic approach to middle cranial fossa (cavernous sinus and carotid artery, clivus, basilar artery or petrous apex) including osteotomy of zygoma, craniotomy, extra- or intradural elevation of temporal lobe
  61595	Transtemporal approach to posterior cranial fossa, jugular foramen or midline skull base, including mastoidectomy, decompression of sigmoid sinus and/or facial nerve, with or without mobilization
  61598	Transpetrosal approach to posterior cranial fossa, clivus or foramen magnum, including ligation of superior petrosal sinus and/or sigmoid sinus
  61600	Resection or excision of neoplastic, vascular or infectious lesion of base of anterior cranial fossa; extradural
  61601	Resection or excision of neoplastic, vascular or infectious lesion of base of anterior cranial fossa; intradural, including dural repair, with or without graft
  61605	Resection or excision of neoplastic, vascular or infectious lesion of infratemporal fossa, parapharyngeal space, petrous apex; extradural
  61606	Resection or excision of neoplastic, vascular or infectious lesion of infratemporal fossa, parapharyngeal space, petrous apex; intradural, including dural repair, with or without graft
  61607	Resection or excision of neoplastic, vascular or infectious lesion of parasellar area, cavernous sinus, clivus or midline skull base; extradural
  61608	Resection or excision of neoplastic, vascular or infectious lesion of parasellar area, cavernous sinus, clivus or midline skull base; intradural, including dural repair, with or without graft
  61615	Resection or excision of neoplastic, vascular or infectious lesion of base of posterior cranial fossa, jugular foramen, foramen magnum, or C1-C3 vertebral bodies; extradural
  61616	Resection or excision of neoplastic, vascular or infectious lesion of base of posterior cranial fossa, jugular foramen, foramen magnum, or C1-C3 vertebral bodies; intradural, including dural repair, with or without graft
  61618	Secondary repair of dura for cerebrospinal fluid leak, anterior, middle or posterior cranial fossa following surgery of the skull base; by free tissue graft (eg, pericranium, fascia, tensor fascia lata, adipose tissue, homologous or synthetic grafts)
  61619	Secondary repair of dura for cerebrospinal fluid leak, anterior, middle or posterior cranial fossa following surgery of the skull base; by local or regionalized vascularized pedicle flap or myocutaneous flap (including galea, temporalis, frontalis or occi
  61680	Surgery of intracranial arteriovenous malformation; supratentorial, simple
  61682	Surgery of intracranial arteriovenous malformation; supratentorial, complex
  61684	Surgery of intracranial arteriovenous malformation; infratentorial, simple
  61686	Surgery of intracranial arteriovenous malformation; infratentorial, complex
  61690	Surgery of intracranial arteriovenous malformation; dural, simple
  61692	Surgery of intracranial arteriovenous malformation; dural, complex
  61697	Surgery of complex intracranial aneurysm, intracranial approach; carotid circulation
  61698	Surgery of complex intracranial aneurysm, intracranial approach; vertebrobasilar circulation
  61700	Surgery of simple intracranial aneurysm, intracranial approach; carotid circulation
  61702	Surgery of simple intracranial aneurysm, intracranial approach; vertebrobasilar circulation
  61703	Surgery of intracranial aneurysm, cervical approach by application of occluding clamp to cervical carotid artery (Selverstone-Crutchfield type)
  61705	Surgery of aneurysm, vascular malformation or carotid-cavernous fistula; by intracranial and cervical occlusion of carotid artery
  61708	Surgery of aneurysm, vascular malformation or carotid-cavernous fistula; by intracranial electrothrombosis
  61710	Surgery of aneurysm, vascular malformation or carotid-cavernous fistula; by intra-arterial embolization, injection procedure, or balloon catheter
  61711	Anastomosis, arterial, extracranial-intracranial (eg, middle cerebral/cortical) arteries
  61720	Creation of lesion by stereotactic method, including burr hole(s) and localizing and recording techniques, single or multiple stages; globus pallidus or thalamus
  61735	Creation of lesion by stereotactic method, including burr hole(s) and localizing and recording techniques, single or multiple stages; subcortical structure(s) other than globus pallidus or thalamus
  61750	Stereotactic biopsy, aspiration, or excision, including burr hole(s), for intracranial lesion
  61751	Stereotactic biopsy, aspiration, or excision, including burr hole(s), for intracranial lesion; with computed tomography and/or magnetic resonance guidance
  61760	Stereotactic implantation of depth electrodes into the cerebrum for long-term seizure monitoring
  61770	Stereotactic localization, including burr hole(s), with insertion of catheter(s) or probe(s) for placement of radiation source
  61850	Twist drill or burr hole(s) for implantation of neurostimulator electrodes, cortical
  61860	Craniectomy or craniotomy for implantation of neurostimulator electrodes, cerebral, cortical
  61863	Twist drill, burr hole, craniotomy, or craniectomy with stereotactic implantation of neurostimulator electrode array in subcortical site (eg, thalamus, globus pallidus, subthalamic nucleus, periventricular, periaqueductal gray), without use of intraoperative microelectrode recording; first array
  61867	Twist drill, burr hole, craniotomy, or craniectomy with stereotactic implantation of neurostimulator electrode array in subcortical site (eg, thalamus, globus pallidus, subthalamic nucleus, periventricular, periaqueductal gray), with use of intraoperative microelectrode recording; first array
  61870	Craniectomy for implantation of neurostimulator electrodes, cerebellar; cortical
  61880	Revision or removal of intracranial neurostimulator electrodes
  62000	Elevation of depressed skull fracture; simple, extradural
  62005	Elevation of depressed skull fracture; compound or comminuted, extradural
  62010	Elevation of depressed skull fracture; with repair of dura and/or debridement of brain
  62100	Craniotomy for repair of dural/cerebrospinal fluid leak, including surgery for rhinorrhea/otorrhea
  62120	Repair of encephalocele, skull vault, including cranioplasty
  62121	Craniotomy for repair of encephalocele, skull base
  62161	Neuroendoscopy, intracranial; with dissection of adhesions, fenestration of septum pellucidum or intraventricular cysts (including placement, replacement, or removal of ventricular catheter)
  62163	Neuroendoscopy, intracranial; with retrieval of foreign body
  62164	Neuroendoscopy, intracranial; with excision of brain tumor, including placement of external ventricular catheter for drainage
  62165	Neuroendoscopy, intracranial; with excision of pituitary tumor, transnasal or trans-sphenoidal approach
  59100	Hysterotomy, abdominal (e.g., for hydatidiform mole, abortion)
  59510	Routine obstetric care including antepartum care, cesarean delivery, and postpartum care
  59514	Cesarean delivery only;
  59515	Cesarean delivery only; including postpartum care
  59618	Routine obstetric care including antepartum care, cesarean delivery, and postpartum care, following attempted vaginal delivery after previous cesarean delivery
  59620	Cesarean delivery only, following attempted vaginal delivery after previous cesarean delivery;
  59622	Cesarean delivery only, following attempted vaginal delivery after previous cesarean delivery; including postpartum care
  59857	Induced abortion, by 1 or more vaginal suppositories (e.g., prostaglandin) with or without cervical dilation (e.g., laminaria), including hospital admission and visits, delivery of fetus and secundines; with hysterotomy (failed medical evacuation)
  22532	Arthrodesis, lateral extracavitary technique, including minimal discectomy to prepare interspace (other than for decompression); thoracic
  22533	Arthrodesis, lateral extracavitary technique, including minimal discectomy to prepare interspace (other than for decompression); lumbar
  22548	Arthrodesis, anterior transoral or extraoral technique, clivus-C1-C2 (atlas-axis), with or without excision of odontoid process
  22551	Arthrodesis, anterior interbody, including disc space preparation, discectomy, osteophytectomy and decompression of spinal cord and/or nerve roots; cervical below C2
  22554	Arthrodesis, anterior interbody technique, including minimal discectomy to prepare interspace (other than for decompression); cervical below C2
  22556	Arthrodesis, anterior interbody technique, including minimal discectomy to prepare interspace (other than for decompression); thoracic
  22558	Arthrodesis, anterior interbody technique, including minimal discectomy to prepare interspace (other than for decompression); lumbar
  22586	Arthrodesis, pre-sacral interbody technique, including disc space preparation, discectomy, with posterior instrumentation, with image guidance, includes bone graft when performed, L5-S1 interspace
  22590	Arthrodesis, posterior technique, craniocervical (occiput-C2)
  22595	Arthrodesis, posterior technique, atlas-axis (C1-C2)
  22600	Arthrodesis, posterior or posterolateral technique, single level; cervical below C2 segment
  22610	Arthrodesis, posterior or posterolateral technique, single level; thoracic (with lateral transverse technique, when performed)
  22612	Arthrodesis, posterior or posterolateral technique, single level; lumbar (with lateral transverse technique, when performed)
  22630	Arthrodesis, posterior interbody technique, including laminectomy and/or discectomy to prepare interspace (other than for decompression), single interspace; lumbar
  22633	Arthrodesis, combined posterior or posterolateral technique with posterior interbody technique including laminectomy and/or discectomy sufficient to prepare interspace (other than for decompression), single interspace and segment; lumbar
  22800	Arthrodesis, posterior, for spinal deformity, with or without cast; up to 6 vertebral segments
  22802	Arthrodesis, posterior, for spinal deformity, with or without cast; 7 to 12 vertebral segments
  22804	Arthrodesis, posterior, for spinal deformity, with or without cast; 13 or more vertebral segments
  22808	Arthrodesis, anterior, for spinal deformity, with or without cast; 2 to 3 vertebral segments
  22810	Arthrodesis, anterior, for spinal deformity, with or without cast; 4 to 7 vertebral segments
  22812	Arthrodesis, anterior, for spinal deformity, with or without cast; 8 or more vertebral segments
  27280	Arthrodesis, open, sacroiliac joint, including obtaining bone graft, including instrumentation, when performed
  23615	Open treatment of proximal humeral (surgical or anatomical neck) fracture, includes internal fixation, when performed, includes repair of tuberosity(s), when performed;
  23616	Open treatment of proximal humeral (surgical or anatomical neck) fracture, includes internal fixation, when performed, includes repair of tuberosity(s), when performed; with proximal humeral prosthetic replacement
  23630	Open treatment of greater humeral tuberosity fracture, includes internal fixation, when performed
  23670	Open treatment of shoulder dislocation, with fracture of greater humeral tuberosity, includes internal fixation, when performed
  23680	Open treatment of shoulder dislocation, with surgical or anatomical neck fracture, includes internal fixation, when performed
  24515	Open treatment of humeral shaft fracture with plate/screws, with or without cerclage
  24516	Treatment of humeral shaft fracture, with insertion of intramedullary implant, with or without cerclage and/or locking screws
  24545	Open treatment of humeral supracondylar or transcondylar fracture, includes internal fixation, when performed; without intercondylar extension
  24546	Open treatment of humeral supracondylar or transcondylar fracture, includes internal fixation, when performed; with intercondylar extension
  24575	Open treatment of humeral epicondylar fracture, medial or lateral, includes internal fixation, when performed
  24579	Open treatment of humeral condylar fracture, medial or lateral, includes internal fixation, when performed
  24586	Open treatment of periarticular fracture and/or dislocation of the elbow (fracture distal humerus and proximal ulna and/or proximal radius);
  24587	Open treatment of periarticular fracture and/or dislocation of the elbow (fracture distal humerus and proximal ulna and/or proximal radius); with implant arthroplasty
  24635	Open treatment of Monteggia type of fracture dislocation at elbow (fracture proximal end of ulna with dislocation of radial head), includes internal fixation, when performed
  24665	Open treatment of radial head or neck fracture, includes internal fixation or radial head excision, when performed;
  24666	Open treatment of radial head or neck fracture, includes internal fixation or radial head excision, when performed; with radial head prosthetic replacement
  24685	Open treatment of ulnar fracture, proximal end (eg, olecranon or coronoid process[es]), includes internal fixation, when performed
  25337	Reconstruction for stabilization of unstable distal ulna or distal radioulnar joint, secondary by soft tissue stabilization (eg, tendon transfer, tendon graft or weave, or tenodesis) with or without open reduction of distal radioulnar joint
  25515	Open treatment of radial shaft fracture, includes internal fixation, when performed
  25525	Open treatment of radial shaft fracture, includes internal fixation, when performed, and open treatment of distal radioulnar joint dislocation (Galeazzi fracture/ dislocation), includes percutaneous skeletal fixation when performed
  25526	Open treatment of radial shaft fracture, includes internal fixation, when performed, and open treatment of distal radioulnar joint dislocation (Galeazzi fracture/ dislocation), includes internal fixation, when performed, includes repair of triangular fibrocartilage complex
  25545	Open treatment of ulnar shaft fracture, includes internal fixation, when performed
  25574	Open treatment of radial AND ulnar shaft fractures, with internal fixation, when performed; of radius OR ulna
  25575	Open treatment of radial AND ulnar shaft fractures, with internal fixation, when performed; of radius AND ulna
  25607	Open treatment of distal radial extra-articular fracture or epiphyseal separation, with internal fixation
  25608	Open treatment of distal radial intra-articular fracture or epiphyseal separation; with internal fixation of 2 fragments
  25609	Open treatment of distal radial intra-articular fracture or epiphyseal separation; with internal fixation of 3 or more fragments
  25652	Open treatment of ulnar styloid fracture
  27177	Open treatment of slipped femoral epiphysis; single or multiple pinning or bone graft (includes obtaining graft)
  27178	Open treatment of slipped femoral epiphysis; closed manipulation with single or multiple pinning
  27179	Open treatment of slipped femoral epiphysis; osteoplasty of femoral neck (Heyman type procedure)
  27181	Open treatment of slipped femoral epiphysis; osteotomy and internal fixation
  27244	Treatment of intertrochanteric, peritrochanteric, or subtrochanteric femoral fracture; with plate/screw type implant, with or without cerclage
  27245	Treatment of intertrochanteric, peritrochanteric, or subtrochanteric femoral fracture; with intramedullary implant, with or without interlocking screws and/or cerclage
  27248	Open treatment of greater trochanteric fracture, includes internal fixation, when performed
  27254	Open treatment of hip dislocation, traumatic, with acetabular wall and femoral head fracture, with or without internal or external fixation
  27269	Open treatment of femoral fracture, proximal end, head, includes internal fixation, when performed
  27506	Open treatment of femoral shaft fracture, with or without external fixation, with insertion of intramedullary implant, with or without cerclage and/or locking screws
  27507	Open treatment of femoral shaft fracture with plate/screws, with or without cerclage
  27511	Open treatment of femoral supracondylar or transcondylar fracture without intercondylar extension, includes internal fixation, when performed
  27513	Open treatment of femoral supracondylar or transcondylar fracture with intercondylar extension, includes internal fixation, when performed
  27514	Open treatment of femoral fracture, distal end, medial or lateral condyle, includes internal fixation, when performed
  27519	Open treatment of distal femoral epiphyseal separation, includes internal fixation, when performed
  27535	Open treatment of tibial fracture, proximal (plateau); unicondylar, includes internal fixation, when performed
  27536	Open treatment of tibial fracture, proximal (plateau); bicondylar, with or without internal fixation
  27540	Open treatment of intercondylar spine(s) and/or tuberosity fracture(s) of the knee, includes internal fixation, when performed
  27758	Open treatment of tibial shaft fracture (with or without fibular fracture), with plate/screws, with or without cerclage
  27759	Treatment of tibial shaft fracture (with or without fibular fracture) by intramedullary implant, with or without interlocking screws and/or cerclage
  27766	Open treatment of medial malleolus fracture, includes internal fixation, when performed
  27769	Open treatment of posterior malleolus fracture, includes internal fixation, when performed
  27784	Open treatment of proximal fibula or shaft fracture, includes internal fixation, when performed
  27792	Open treatment of distal fibular fracture (lateral malleolus), includes internal fixation, when performed
  27814	Open treatment of bimalleolar ankle fracture (eg, lateral and medial malleoli, or lateral and posterior malleoli, or medial and posterior malleoli), includes internal fixation, when performed
  27822	Open treatment of trimalleolar ankle fracture, includes internal fixation, when performed, medial and/or lateral malleolus; without fixation of posterior lip
  27823	Open treatment of trimalleolar ankle fracture, includes internal fixation, when performed, medial and/or lateral malleolus; with fixation of posterior lip
  27826	Open treatment of fracture of weight bearing articular surface/portion of distal tibia (eg, pilon or tibial plafond), with internal fixation, when performed; of fibula only
  27827	Open treatment of fracture of weight bearing articular surface/portion of distal tibia (eg, pilon or tibial plafond), with internal fixation, when performed; of tibia only
  27828	Open treatment of fracture of weight bearing articular surface/portion of distal tibia (eg, pilon or tibial plafond), with internal fixation, when performed; of both tibia and fibula
  27829	Open treatment of distal tibiofibular joint (syndesmosis) disruption, includes internal fixation, when performed
  43117	Partial esophagectomy, distal two-thirds, with thoracotomy and separate abdominal incision, with or without proximal gastrectomy; with thoracic esophagogastrostomy, with or without pyloroplasty (Ivor Lewis)
  43118	Partial esophagectomy, distal two-thirds, with thoracotomy and separate abdominal incision, with or without proximal gastrectomy; with colon interposition or small intestine reconstruction, including intestine mobilization, preparation, and anastomosis(es)
  43121	Partial esophagectomy, distal two-thirds, with thoracotomy only, with or without proximal gastrectomy, with thoracic esophagogastrostomy, with or without pyloroplasty
  43122	Partial esophagectomy, thoracoabdominal or abdominal approach, with or without proximal gastrectomy; with esophagogastrostomy, with or without pyloroplasty
  43320	Esophagogastrostomy (cardioplasty), with or without vagotomy and pyloroplasty, transabdominal or transthoracic approach
  43360	Gastrointestinal reconstruction for previous esophagectomy, for obstructing esophageal lesion or fistula, or for previous esophageal exclusion; with stomach, with or without pyloroplasty
  43500	Gastrotomy; with exploration or foreign body removal
  43501	Gastrotomy; with suture repair of bleeding ulcer
  43502	Gastrotomy; with suture repair of pre-existing esophagogastric laceration (eg, Mallory-Weiss)
  43520	Pyloromyotomy, cutting of pyloric muscle (Fredet-Ramstedt type operation)
  43605	Biopsy of stomach, by laparotomy
  43610	Excision, local; ulcer or benign tumor of stomach
  43611	Excision, local; malignant tumor of stomach
  43620	Gastrectomy, total; with esophagoenterostomy
  43621	Gastrectomy, total; with Roux-en-Y reconstruction
  43622	Gastrectomy, total; with formation of intestinal pouch, any type
  43631	Gastrectomy, partial, distal; with gastroduodenostomy
  43632	Gastrectomy, partial, distal; with gastrojejunostomy
  43633	Gastrectomy, partial, distal; with Roux-en-Y reconstruction
  43634	Gastrectomy, partial, distal; with formation of intestinal pouch
  43640	Vagotomy including pyloroplasty, with or without gastrostomy; truncal or selective
  43641	Vagotomy including pyloroplasty, with or without gastrostomy; parietal cell (highly selective)
  43644	Laparoscopy, surgical, gastric restrictive procedure; with gastric bypass and Roux-en-Y gastroenterostomy (roux limb 150 cm or less)
  43645	Laparoscopy, surgical, gastric restrictive procedure; with gastric bypass and small intestine reconstruction to limit absorption
  43770	Laparoscopy, surgical, gastric restrictive procedure; placement of adjustable gastric restrictive device (eg, gastric band and subcutaneous port components)
  43771	Laparoscopy, surgical, gastric restrictive procedure; revision of adjustable gastric restrictive device component only
  43772	Laparoscopy, surgical, gastric restrictive procedure; removal of adjustable gastric restrictive device component only
  43773	Laparoscopy, surgical, gastric restrictive procedure; removal and replacement of adjustable gastric restrictive device component only
  43774	Laparoscopy, surgical, gastric restrictive procedure; removal of adjustable gastric restrictive device and subcutaneous port components
  43775	Laparoscopy, surgical, gastric restrictive procedure; longitudinal gastrectomy (ie, sleeve gastrectomy)
  43800	Pyloroplasty
  43810	Gastroduodenostomy
  43820	Gastrojejunostomy; without vagotomy
  43825	Gastrojejunostomy; with vagotomy, any type
  43840	Gastrorrhaphy, suture of perforated duodenal or gastric ulcer, wound, or injury
  43842	Gastric restrictive procedure, without gastric bypass, for morbid obesity; vertical-banded gastroplasty
  43843	Gastric restrictive procedure, without gastric bypass, for morbid obesity; other than vertical-banded gastroplasty
  43845	Gastric restrictive procedure with partial gastrectomy, pylorus-preserving duodenoileostomy and ileoileostomy (50 to 100 cm common channel) to limit absorption (biliopancreatic diversion with duodenal switch)
  43846	Gastric restrictive procedure, with gastric bypass for morbid obesity; with short limb (150 cm or less) Roux-en-Y gastroenterostomy
  43847	Gastric restrictive procedure, with gastric bypass for morbid obesity; with small intestine reconstruction to limit absorption
  43848	Revision, open, of gastric restrictive procedure for morbid obesity, other than adjustable gastric restrictive device (separate procedure)
  43850	Revision of gastroduodenal anastomosis (gastroduodenostomy) with reconstruction; without vagotomy
  43855	Revision of gastroduodenal anastomosis (gastroduodenostomy) with reconstruction; with vagotomy
  43860	Revision of gastrojejunal anastomosis (gastrojejunostomy) with reconstruction, with or without partial gastrectomy or intestine resection; without vagotomy
  43865	Revision of gastrojejunal anastomosis (gastrojejunostomy) with reconstruction, with or without partial gastrectomy or intestine resection; with vagotomy
  43870	Closure of gastrostomy, surgical
  43880	Closure of gastrocolic fistula
  43886	Gastric restrictive procedure, open; revision of subcutaneous port component only
  43887	Gastric restrictive procedure, open; removal of subcutaneous port component only
  43888	Gastric restrictive procedure, open; removal and replacement of subcutaneous port component only
  43286	Esophagectomy, total or near total, with laparoscopic mobilization of the abdominal and mediastinal esophagus and proximal gastrectomy, with laparoscopic pyloric drainage procedure if performed, with open cervical pharyngogastrostomy or esophagogastrostomy (ie, laparoscopic transhiatal esophagectomy)
  43287	Esophagectomy, distal two-thirds, with laparoscopic mobilization of the abdominal and lower mediastinal esophagus and proximal gastrectomy, with laparoscopic pyloric drainage procedure if performed, with separate thoracoscopic mobilization of the middle and upper mediastinal esophagus and thoracic esophagogastrostomy (ie, laparoscopic thoracoscopic esophagectomy, Ivor Lewis esophagectomy)
  43288	Esophagectomy, total or near total, with thoracoscopic mobilization of the upper, middle, and lower mediastinal esophagus, with separate laparoscopic proximal gastrectomy, with laparoscopic pyloric drainage procedure if performed, with open cervical pharyngogastrostomy or esophagogastrostomy (ie, thoracoscopic, laparoscopic and cervical incision esophagectomy, McKeown esophagectomy, tri-incisional esophagectomy)
  11008	Removal of prosthetic material or mesh, abdominal wall for infection (eg, for chronic or recurrent mesh infection or necrotizing soft tissue infection) (List separately in addition to code for primary procedure)
  49491	Repair, initial inguinal hernia, preterm infant (younger than 37 weeks gestation at birth), performed from birth up to 50 weeks postconception age, with or without hydrocelectomy; reducible
  49492	Repair, initial inguinal hernia, preterm infant (younger than 37 weeks gestation at birth), performed from birth up to 50 weeks postconception age, with or without hydrocelectomy; incarcerated or strangulated
  49495	Repair, initial inguinal hernia, full term infant younger than age 6 months, or preterm infant older than 50 weeks postconception age and younger than age 6 months at the time of surgery, with or without hydrocelectomy; reducible
  49496	Repair, initial inguinal hernia, full term infant younger than age 6 months, or preterm infant older than 50 weeks postconception age and younger than age 6 months at the time of surgery, with or without hydrocelectomy; incarcerated or strangulated
  49500	Repair initial inguinal hernia, age 6 months to younger than 5 years, with or without hydrocelectomy; reducible
  49501	Repair initial inguinal hernia, age 6 months to younger than 5 years, with or without hydrocelectomy; incarcerated or strangulated
  49505	Repair initial inguinal hernia, age 5 years or older; reducible
  49507	Repair initial inguinal hernia, age 5 years or older; incarcerated or strangulated
  49520	Repair recurrent inguinal hernia, any age; reducible
  49521	Repair recurrent inguinal hernia, any age; incarcerated or strangulated
  49525	Repair inguinal hernia, sliding, any age
  49550	Repair initial femoral hernia, any age; reducible
  49553	incarcerated or strangulated
  49555	Repair recurrent femoral hernia; reducible
  49557	Repair recurrent femoral hernia; incarcerated or strangulated
  49560	Repair initial incisional or ventral hernia; reducible
  49561	Repair initial incisional or ventral hernia; incarcerated or strangulated
  49565	Repair recurrent incisional or ventral hernia; reducible
  49566	Repair recurrent incisional or ventral hernia; incarcerated or strangulated
  49570	Repair epigastric hernia (eg, preperitoneal fat); reducible (separate procedure)
  49572	Repair epigastric hernia (eg, preperitoneal fat); incarcerated or strangulated
  49580	Repair umbilical hernia, younger than age 5 years; reducible
  49582	Repair umbilical hernia, younger than age 5 years; incarcerated or strangulated
  49585	Repair umbilical hernia, age 5 years or older; reducible
  49587	Repair umbilical hernia, age 5 years or older; incarcerated or strangulated
  49590	Repair spigelian hernia
  49600	Repair of small omphalocele, with primary closure
  49605	Repair of large omphalocele or gastroschisis; with or without prosthesis
  49606	Repair of large omphalocele or gastroschisis; with removal of prosthesis, final reduction and closure, in operating room
  49610	Repair of omphalocele (Gross type operation); first stage
  49611	Repair of omphalocele (Gross type operation); second stage
  49650	Laparoscopy, surgical; repair initial inguinal hernia
  49651	Laparoscopy, surgical; repair recurrent inguinal hernia
  49652	Laparoscopy, surgical, repair, ventral, umbilical, spigelian or epigastric hernia (includes mesh insertion, when performed); reducible
  49653	Laparoscopy, surgical, repair, ventral, umbilical, spigelian or epigastric hernia (includes mesh insertion, when performed); incarcerated or strangulated
  49654	Laparoscopy, surgical, repair, incisional hernia (includes mesh insertion, when performed); reducible
  49655	Laparoscopy, surgical, repair, incisional hernia (includes mesh insertion, when performed); incarcerated or strangulated
  49656	Laparoscopy, surgical, repair, recurrent incisional hernia (includes mesh insertion, when performed); reducible
  49657	Laparoscopy, surgical, repair, recurrent incisional hernia (includes mesh insertion, when performed); incarcerated or strangulated
  49659	Unlisted laparoscopy procedure, hernioplasty, herniorrhaphy, herniotomy
  27125	Hemiarthroplasty, hip, partial (eg, femoral stem prosthesis, bipolar arthroplasty)
  27130	Arthroplasty, acetabular and proximal femoral prosthetic replacement (total hip arthroplasty), with or without autograft or allograft
  27132	Conversion of previous hip surgery to total hip arthroplasty, with or without autograft or allograft
  27134	Revision of total hip arthroplasty; both components, with or without autograft or allograft
  27137	Revision of total hip arthroplasty; acetabular component only, with or without autograft or allograft
  27138	Revision of total hip arthroplasty; femoral component only, with or without allograft
  27236	Open treatment of femoral fracture, proximal end, neck, internal fixation or prosthetic replacement
  33935	Heart-lung transplant with recipient cardiectomy-pneumonectomy
  33945	Heart transplant, with or without recipient cardiectomy
  58150	Total abdominal hysterectomy (corpus and cervix), with or without removal of tube(s), with or without removal of ovary(s)
  58152	Total abdominal hysterectomy (corpus and cervix), with or without removal of tube(s), with or without removal of ovary(s); with colpo-urethrocystopexy (eg, Marshall-Marchetti-Krantz, Burch)
  58180	Supracervical abdominal hysterectomy (subtotal hysterectomy), with or without removal of tube(s), with or without removal of ovary(s)
  58200	Total abdominal hysterectomy, including partial vaginectomy, with para-aortic and pelvic lymph node sampling, with or without removal of tube(s), with or without removal of ovary(s)
  58210	Radical abdominal hysterectomy, with bilateral total pelvic lymphadenectomy and para-aortic lymph node sampling (biopsy), with or without removal of tube(s), with or without removal of ovary(s)
  58240	Pelvic exenteration for gynecologic malignancy, with total abdominal hysterectomy or cervicectomy, with or without removal of tube(s), with or without removal of ovary(s), with removal of bladder and ureteral transplantations, and/or abdominoperineal resection of rectum and colon and colostomy, or any combination thereof
  58541	Laparoscopy, surgical, supracervical hysterectomy, for uterus 250 g or less
  58542	Laparoscopy, surgical, supracervical hysterectomy, for uterus 250 g or less; with removal of tube(s) and/or ovary(s)
  58543	Laparoscopy, surgical, supracervical hysterectomy, for uterus greater than 250 g
  58544	Laparoscopy, surgical, supracervical hysterectomy, for uterus greater than 250 g; with removal of tube(s) and/or ovary(s)
  58548	Laparoscopy, surgical, with radical hysterectomy, with bilateral total pelvic lymphadenectomy and para-aortic lymph node sampling (biopsy), with removal of tube(s) and ovary(s), if performed
  58550	Laparoscopy, surgical, with vaginal hysterectomy, for uterus 250 g or less
  58552	Laparoscopy, surgical, with vaginal hysterectomy, for uterus 250 g or less; with removal of tubes(s) and /or ovary(s)
  58553	Laparoscopy, surgical, with vaginal hysterectomy, for uterus greater than 250 g
  58554	Laparoscopy, surgical, with vaginal hysterectomy, for uterus greater than 250 g; with removal of tube(s) and/or ovary(s)
  58570	Laparoscopy, surgical, with total hysterectomy, for uterus 250 g or less
  58571	Laparoscopy, surgical, with total hysterectomy, for uterus 250 g or less; with removal of tube(s) and/or ovary(s)
  58572	Laparoscopy, surgical, with total hysterectomy, for uterus greater than 250 g
  58573	Laparoscopy, surgical, with total hysterectomy, for uterus greater than 250 g; with removal of tube(s) and/or ovary(s)
  58951	Resection (initial) of ovarian, tubal or primary peritoneal malignancy with bilateral salpingo-oophorectomy and omentectomy; with total abdominal hysterectomy, pelvic and limited para-aortic lymphadenectomy
  58953	Bilateral salpingo-oophorectomy with omentectomy, total abdominal hysterectomy and radical dissection for debulking
  58954	Bilateral salpingo-oophorectomy with omentectomy, total abdominal hysterectomy and radical dissection for debulking; with pelvic lymphadenectomy and limited para-aortic lymphadenectomy
  58956	Bilateral salpingo-oophorectomy with total omentectomy, total abdominal hysterectomy for malignancy
  59525	Subtotal or total hysterectomy after cesarean delivery
  58575	Laparoscopy, surgical, total hysterectomy for resection of malignancy (tumor debulking), with omentectomy including salpingo-oophorectomy, unilateral or bilateral, when performed
  27438	Arthroplasty, patella; with prosthesis
  27440	Arthroplasty, knee, tibial plateau
  27441	Arthroplasty, knee, tibial plateau; with debridement and partial synovectomy
  27442	Arthroplasty, femoral condyles or tibial plateau(s), knee
  27443	Arthroplasty, femoral condyles or tibial plateau(s), knee; with debridement and partial synovectomy
  27445	Arthroplasty, knee, hinge prosthesis (eg, Walldius type)
  27446	Arthroplasty, knee, condyle and plateau; medial OR lateral compartment
  27447	Arthroplasty, knee, condyle and plateau; medial AND lateral compartments with or without patella resurfacing (total knee arthroplasty)
  27486	Revision of total knee athroplasty, with or without allograft, one component
  27487	Revision of total knee arthroplasty, with or without allograft; femoral and entire tibial component
  50340	Recipient nephrectomy (separate procedure)
  50360	Renal allotransplantation, implantation of graft; without recipient nephrectomy
  50365	Renal allotransplantation, implantation of graft; with recipient nephrectomy
  50380	Renal autotransplantation, reimplantation of kidney
  22220	Osteotomy of spine, including discectomy, anterior approach, single vertebral segment; cervical
  22222	Osteotomy of spine, including discectomy, anterior approach, single vertebral segment; thoracic
  22224	Osteotomy of spine, including discectomy, anterior approach, single vertebral segment; lumbar
  22856	Total disc arthroplasty (artificial disc), anterior approach, including discectomy with end plate preparation (includes osteophytectomy for nerve root or spinal cord decompression and microdissection); single interspace, cervical
  22857	Total disc arthroplasty (artificial disc), anterior approach, including discectomy to prepare interspace (other than for decompression), single interspace, lumbar
  22861	Revision including replacement of total disc arthroplasty (artificial disc), anterior approach, single interspace; cervical
  22862	Revision including replacement of total disc arthroplasty (artificial disc), anterior approach, single interspace; lumbar
  22867	Insertion of interlaminar/interspinous process stabilization/distraction device, without fusion, including image guidance when performed, with open decompression, lumbar; single level
  62287	Decompression procedure, percutaneous, of nucleus pulposus of intervertebral disc, any method utilizing needle based technique to remove disc material under fluoroscopic imaging or other form of indirect visualization, with the use of an endoscope, with discography and/or epidural injection(s) at the treated level(s), when performed, single or multiple levels, lumbar
  62351	Implantation, revision or repositioning of tunneled intrathecal or epidural catheter, for long-term medication administration via an external pump or implantable reservoir/infusion pump; with laminectomy
  62380	Endoscopic decompression of spinal cord, nerve root(s), including laminectomy, partial facetectomy, foraminotomy, discectomy and/or excision of herniated intervertebral disc, 1 interpace, lumbar
  63001	Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina, without facetectomy, foraminotomy or discectomy (eg, spinal stenosis), 1 or 2 vertebral segments; cervical
  63003	Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina, without facetectomy, foraminotomy or discectomy (eg, spinal stenosis), 1 or 2 vertebral segments; thoracic
  63005	Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina, without facetectomy, foraminotomy or discectomy (eg, spinal stenosis), 1 or 2 vertebral segments; lumbar, except for spondylolisthesis
  63011	Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina, without facetectomy, foraminotomy or discectomy (eg, spinal stenosis), 1 or 2 vertebral segments; sacral
  63012	Laminectomy with removal of abnormal facets and/or pars inter-articularis with decompression of cauda equina and nerve roots for spondylolisthesis, lumbar (Gill type procedure)
  63015	Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina, without facetectomy, foraminotomy or discectomy (eg, spinal stenosis), more than 2 vertebral segments; cervical
  63016	Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina, without facetectomy, foraminotomy or discectomy (eg, spinal stenosis), more than 2 vertebral segments; thoracic
  63017	Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina, without facetectomy, foraminotomy or discectomy (eg, spinal stenosis), more than 2 vertebral segments; lumbar
  63020	Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc; 1 interspace, cervical
  63030	Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc; 1 interspace, lumbar
  63035	Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc; each additional interspace, cervical or lumbar (List separately in addition to code for primary procedure)
  63040	Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc, reexploration, single interspace; cervical
  63042	Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc, reexploration, single interspace; lumbar
  63045	Laminectomy, facetectomy and foraminotomy (unilateral or bilateral with decompression of spinal cord, cauda equina and/or nerve root[s], [eg, spinal or lateral recess stenosis]), single vertebral segment; cervical
  63046	Laminectomy, facetectomy and foraminotomy (unilateral or bilateral with decompression of spinal cord, cauda equina and/or nerve root[s], [eg, spinal or lateral recess stenosis]), single vertebral segment; thoracic
  63047	Laminectomy, facetectomy and foraminotomy (unilateral or bilateral with decompression of spinal cord, cauda equina and/or nerve root[s], [eg, spinal or lateral recess stenosis]), single vertebral segment; lumbar
  63048	Laminectomy, facetectomy and foraminotomy (unilateral or bilateral with decompression of spinal cord, cauda equina and/or nerve root[s], [eg, spinal or lateral recess stenosis]), single vertebral segment; each additional segment, cervical, thoracic, or lumbar (List separately in addition to code for primary procedure)
  63050	Laminoplasty, cervical, with decompression of the spinal cord, 2 or more vertebral segments;
  63051	Laminoplasty, cervical, with decompression of the spinal cord, 2 or more vertebral segments; with reconstruction of the posterior bony elements (including the application of bridging bone graft and non-segmental fixation devices [eg, wire, suture, mini-plates], when performed)
  63055	Transpedicular approach with decompression of spinal cord, equina and/or nerve root(s) (eg, herniated intervertebral disc), single segment; thoracic
  63056	lumbar (including transfacet, or lateral extraforaminal approach) (eg, far lateral herniated intervertebral disc
  63064	Costovertebral approach with decompression of spinal cord or nerve root(s), (eg, herniated intervertebral disc), thoracic; single segment
  63075	Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; cervical, single interspace
  63077	Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; thoracic, single interspace
  63081	Vertebral corpectomy (vertebral body resection), partial or complete, anterior approach with decompression of spinal cord and/or nerve root(s); cervical, single segment
  63082	Vertebral corpectomy (vertebral body resection), partial or complete, anterior approach with decompression of spinal cord and/or nerve root(s); cervical, each additional segment (List separately in addition to code for primary procedure)
  63085	Vertebral corpectomy (vertebral body resection), partial or complete, transthoracic approach with decompression of spinal cord and/or nerve root(s); thoracic, single segment
  63086	Vertebral corpectomy (vertebral body resection), partial or complete, transthoracic approach with decompression of spinal cord and/or nerve root(s); thoracic, each additional segment (List separately in addition to code for primary procedure)
  63087	Vertebral corpectomy (vertebral body resection), partial or complete, combined thoracolumbar approach with decompression of spinal cord, cauda equina or nerve root(s), lower thoracic or lumbar; single segment
  63088	Vertebral corpectomy (vertebral body resection), partial or complete, combined thoracolumbar approach with decompression of spinal cord, cauda equina or nerve root(s), lower thoracic or lumbar; each additional segment (List separately in addition to code for primary procedure)
  63090	Vertebral corpectomy (vertebral body resection), partial or complete, transperitoneal or retroperitoneal approach with decompression of spinal cord, cauda equina or nerve root(s), lower thoracic, lumbar, or sacral; single segment
  63091	Vertebral corpectomy (vertebral body resection), partial or complete, transperitoneal or retroperitoneal approach with decompression of spinal cord, cauda equina or nerve root(s), lower thoracic, lumbar, or sacral; each additional segment (List separately in addition to code for primary procedure)
  63101	Vertebral corpectomy (vertebral body resection), partial or complete, lateral extracavitary approach with decompression of spinal cord and/or nerve root(s) (eg, for tumor or retropulsed bone fragments); thoracic, single segment
  63102	Vertebral corpectomy (vertebral body resection), partial or complete, lateral extracavitary approach with decompression of spinal cord and/or nerve root(s) (eg, for tumor or retropulsed bone fragments); lumbar, single segment
  63103	Vertebral corpectomy (vertebral body resection), partial or complete, lateral extracavitary approach with decompression of spinal cord and/or nerve root(s) (eg, for tumor or retropulsed bone fragments); thoracic or lumbar, each additional segment (List separately in addition to code for primary procedure)
  63170	Laminectomy with myelotomy (eg, Bischof or DREZ type), cervical, thoracic, or thoracolumbar
  63172	Laminectomy with drainage of intramedullary cyst/syrinx; to subarachnoid space
  63173	Laminectomy with drainage of intramedullary cyst/syrinx; to peritoneal or pleural space
  63180	Laminectomy and section of dentate ligaments, with or without dural graft, cervical; 1 or 2 segments
  63182	Laminectomy and section of dentate ligaments, with or without dural graft, cervical; more than 2 segments
  63185	Laminectomy with rhizotomy; 1 or 2 segments
  63190	Laminectomy with rhizotomy; more than 2 segments
  63191	Laminectomy with section of spinal accessory nerve
  63194	Laminectomy with cordotomy, with section of 1 spinothalamic tract, 1 stage; cervical
  63195	Laminectomy with cordotomy, with section of 1 spinothalamic tract, 1 stage; thoracic
  63196	Laminectomy with cordotomy, with section of both spinothalamic tracts, 1 stage; cervical
  63197	Laminectomy with cordotomy, with section of both spinothalamic tracts, 1 stage; thoracic
  63198	Laminectomy with cordotomy with section of both spinothalamic tracts, 2 stages within 14 days; cervical
  63199	Laminectomy with cordotomy with section of both spinothalamic tracts, 2 stages within 14 days; thoracic
  63200	Laminectomy, with release of tethered spinal cord, lumbar
  0202T	Posterior vertebral joint(s) arthroplasty (eg, facet joint[s] replacement), including facetectomy, laminectomy, foraminotomy, and vertebral column fixation, injection of bone cement, when performed, including fluoroscopy, single level, lumbar spine
  0219T	Placement of a posterior intrafacet implant(s), unilateral or bilateral, including imaging and placement of bone graft(s) or synthetic device(s), single level; cervical
  0220T	Placement of a posterior intrafacet implant(s), unilateral or bilateral, including imaging and placement of bone graft(s) or synthetic device(s), single level; thoracic
  0221T	Placement of a posterior intrafacet implant(s), unilateral or bilateral, including imaging and placement of bone graft(s) or synthetic device(s), single level; lumbar
  0375T	Total disc arthroplasty (artificial disc), anterior approach, including discectomy with end plate preparation (includes osteophytectomy for nerve root or spinal cord decompression and microdissection), cervical, three or more levels
  47135	Liver allotransplantation; orthotopic, partial or whole, from cadaver or living donor, any age
  47399	Unlisted procedure, liver
  31300	Laryngotomy (thyrotomy, laryngofissure); with removal of tumor or laryngocele, cordectomy
  31360	Laryngectomy; total, without radical neck dissection
  31365	Laryngectomy; total, with radical neck dissection
  31367	Laryngectomy; subtotal supraglottic, without radical neck dissection
  31368	Laryngectomy; subtotal supraglottic, with radical neck dissection
  31370	Partial laryngectomy (hemilaryngectomy); horizontal
  31375	Partial laryngectomy (hemilaryngectomy); laterovertical
  31380	Partial laryngectomy (hemilaryngectomy); anterovertical
  31382	Partial laryngectomy (hemilaryngectomy); antero-latero-vertical
  31390	Pharyngolaryngectomy, with radical neck dissection; without reconstruction
  31395	Pharyngolaryngectomy, with radical neck dissection; with reconstruction
  31400	Arytenoidectomy or arytenoidopexy, external approach
  31420	Epiglottidectomy
  31551	Laryngoplasty; for laryngeal stenosis, with graft, without indwelling stent placement, younger than 12 years of age
  31552	Laryngoplasty; for laryngeal stenosis, with graft, without indwelling stent placement, age 12 years or older
  31553	Laryngoplasty; for laryngeal stenosis, with graft, with indwelling stent placement, younger than 12 years of age
  31554	Laryngoplasty; for laryngeal stenosis, with graft, with indwelling stent placement, age 12 years or older
  31560	Laryngoscopy, direct, operative, with arytenoidectomy;
  31561	Laryngoscopy, direct, operative, with arytenoidectomy; with operating microscope or telescope
  31580	Laryngoplasty; for laryngeal web, with indwelling keel or stent insertion
  31584	Laryngoplasty; with open reduction and fixation of (eg, plating) fracture, includes tracheostomy, if performed
  31587	Laryngoplasty, cricoid split, without graft placement
  31590	Laryngeal reinnervation by neuromuscular pedicle
  31591	Laryngoplasty, medialization, unilateral
  31592	Cricotracheal resection
  31599	Unlisted procedure, larynx
  38308	Lymphangiotomy or other operations on lymphatic channels
  38542	Dissection, deep jugular node(s)
  38720	Cervical lymphadenectomy (complete)
  38724	Cervical lymphadenectomy (modified radical neck dissection)
  41135	Glossectomy; partial, with unilateral radical neck dissection
  41140	Glossectomy; complete or total, with or without tracheostomy, without radical neck dissection
  41145	Glossectomy; complete or total, with or without tracheostomy, with unilateral radical neck dissection
  41155	Glossectomy; composite procedure with resection floor of mouth, mandibular resection, and radical neck dissection (Commando type)
  42420	Excision of parotid tumor or parotid gland; total, with dissection and preservation of facial nerve
  42425	Excision of parotid tumor or parotid gland; total, en bloc removal with sacrifice of facial nerve
  42426	Excision of parotid tumor or parotid gland; total, with unilateral radical neck dissection
  69150	Radical excision external auditory canal lesion; without neck dissection
  69155	Radical excision external auditory canal lesion; with neck dissection
  50010	 Renal exploration, not necessitating other specific procedures
  50020	Drainage of perirenal or renal abscess, open
  50040	Nephrostomy, nephrotomy with drainage
  50045	Nephrotomy, with exploration
  50060	Nephrolithotomy; removal of calculus
  50065	Nephrolithotomy; secondary surgical operation for calculus
  50070	Nephrolithotomy; complicated by congenital kidney abnormality
  50075	Nephrolithotomy; removal of large staghorn calculus filling renal pelvis and calyces (including anatrophic pyelolithotomy)
  50120	Pyelotomy; with exploration
  50125	Pyelotomy; with drainage, pyelostomy
  50130	Pyelotomy; with removal of calculus (pyelolithotomy, pelviolithotomy, including coagulum pyelolithotomy)
  50135	Pyelotomy; complicated (e.g., secondary operation, congenital kidney abnormality)
  50205	Renal biopsy; by surgical exposure of kidney
  50220	Nephrectomy, including partial ureterectomy, any open approach including rib resection;
  50225	Nephrectomy, including partial ureterectomy, any open approach including rib resection; complicated because of previous surgery on same kidney
  50230	Nephrectomy, including partial ureterectomy, any open approach including rib resection; radical, with regional lymphadenectomy and/or vena caval thrombectomy
  50234	Nephrectomy with total ureterectomy and bladder cuff; through same incision
  50236	Nephrectomy with total ureterectomy and bladder cuff; through separate incision
  50240	Nephrectomy, partial
  50250	Ablation, open, 1 or more renal mass lesion(s), cryosurgical, including intraoperative ultrasound guidance and monitoring, if performed
  50280	Excision or unroofing of cyst(s) of kidney
  50290	Excision of perinephric cyst
  50320	Donor nephrectomy (including cold preservation); open, from living donor
  50400	Pyeloplasty (Foley Y-pyeloplasty), plastic operation on renal pelvis, with or without plastic operation on ureter, nephropexy, nephrostomy, pyelostomy, or ureteral splinting; simple
  50405	Pyeloplasty (Foley Y-pyeloplasty), plastic operation on renal pelvis, with or without plastic operation on ureter, nephropexy, nephrostomy, pyelostomy, or ureteral splinting; complicated (congenital kidney abnormality, secondary pyeloplasty, solitary kidney, calycoplasty)
  50541	Laparoscopy, surgical; ablation of renal cysts
  50542	Laparoscopy, surgical; ablation of renal mass lesion(s), including intraoperative ultrasound guidance and monitoring, when performed
  50543	Laparoscopy, surgical; partial nephrectomy
  50545	Laparoscopy, surgical; radical nephrectomy (includes removal of Gerota's fascia and surrounding fatty tissue, removal of regional lymph nodes, and adrenalectomy)
  50546	Laparoscopy, surgical; nephrectomy, including partial ureterectomy
  50547	Laparoscopy, surgical; donor nephrectomy (including cold preservation), from living donor
  50548	Laparoscopy, surgical; nephrectomy with total ureterectomy
  50549	Unlisted laparoscopic nephrectomy
  58660	Laparoscopy, surgical; with lysis of adhesions (salpingolysis, ovariolysis) (separate procedure)
  58661	Laparoscopy, surgical; with removal of adnexal structures (partial or total oophorectomy and/or salpingectomy)
  58662	Laparoscopy, surgical; with fulguration or excision of lesions of the ovary, pelvic viscera, or peritoneal surface by any method
  58679	Unlisted laparoscopy procedure, oviduct, ovary
  58720	Salpingo-oophorectomy, complete or partial, unilateral or bilateral (separate procedure)
  58740	Lysis of adhesions (salpingolysis, ovariolysis)
  58800	Drainage of ovarian cyst(s), unilateral or bilateral (separate procedure); vaginal approach
  58805	Drainage of ovarian cyst(s), unilateral or bilateral (separate procedure); abdominal approach
  58820	Drainage of ovarian abscess; vaginal approach, open
  58822	Drainage of ovarian abscess; abdominal approach
  58825	Transposition, ovary(s)
  58900	Biopsy of ovary, unilateral or bilateral (separate procedure)
  58920	Wedge resection or bisection of ovary, unilateral or bilateral
  58925	Ovarian cystectomy, unilateral or bilateral
  58940	Oophorectomy, partial or total, unilateral or bilateral;
  58943	Oophorectomy, partial or total, unilateral or bilateral; for ovarian, tubal or primary peritoneal malignancy, with para-aortic and pelvic lymph node biopsies, peritoneal washings, peritoneal biopsies, diaphragmatic assessments, with or without salpingectomy(s), with or without omentectomy
  58950	Resection (initial) of ovarian, tubal or primary peritoneal malignancy with bilateral salpingo-oophorectomy and omentectomy;
  58952	Resection (initial) of ovarian, tubal or primary peritoneal malignancy with bilateral salpingo-oophorectomy and omentectomy; with radical dissection for debulking (i.e., radical excision or destruction, intra-abdominal or retroperitoneal tumors)
  58970	Follicle puncture for oocyte retrieval, any method
  33202	Insertion of epicardial electrode(s); open incision (e.g., thoracotomy, median sternotomy, subxiphoid approach)
  33203	Insertion of epicardial electrode(s); endoscopic approach (e.g., thoracoscopy, pericardioscopy)
  33206	Insertion of new or replacement of permanent pacemaker with transvenous electrode(s); atrial
  33207	Insertion of new or replacement of permanent pacemaker with transvenous electrode(s); ventricular
  33208	Insertion of new or replacement of permanent pacemaker with transvenous electrode(s); atrial and ventricular
  33212	Insertion of pacemaker pulse generator only; with existing single lead
  33213	Insertion of pacemaker pulse generator only; with existing dual leads
  33214	 Upgrade of implanted pacemaker system, conversion of single chamber system to dual chamber system (includes removal of previously placed pulse generator, testing of existing lead, insertion of new lead, insertion of new pulse generator)
  33215	Repositioning of previously implanted transvenous pacemaker or implantable defibrillator (right atrial or right ventricular) electrode
  33216	Insertion of a single transvenous electrode, permanent pacemaker or implantable defibrillator
  33217	Insertion of 2 transvenous electrodes, permanent pacemaker or implantable defibrillator
  33218	Repair of single transvenous electrode, permanent pacemaker or implantable defibrillator
  33220	Repair of 2 transvenous electrodes for permanent pacemaker or implantable defibrillator
  33221	Insertion of pacemaker pulse generator only; with existing multiple leads
  33222	Relocation of skin pocket for pacemaker
  33223	Relocation of skin pocket for implantable defibrillator
  33224	Insertion of pacing electrode, cardiac venous system, for left ventricular pacing, with attachment to previously placed pacemaker or implantable defibrillator pulse generator (including revision of pocket, removal, insertion, and/or replacement of existing generator)
  33225	Insertion of pacing electrode, cardiac venous system, for left ventricular pacing, at time of insertion of implantable defibrillator or pacemaker pulse generator (e.g., for upgrade to dual chamber system) (List separately in addition to code for primary procedure)
  33226	Repositioning of previously implanted cardiac venous system (left ventricular) electrode (including removal, insertion and/or replacement of existing generator)
  33227	Removal of permanent pacemaker pulse generator with replacement of pacemaker pulse generator; single lead system
  33228	Removal of permanent pacemaker pulse generator with replacement of pacemaker pulse generator; dual lead system
  33229	Removal of permanent pacemaker pulse generator with replacement of pacemaker pulse generator; multiple lead system
  33230	Insertion of implantable defibrillator pulse generator only; with existing dual leads
  33231	Insertion of implantable defibrillator pulse generator only; with existing multiple leads
  33233	Removal of permanent pacemaker pulse generator only
  33234	Removal of transvenous pacemaker electrode(s); single lead system, atrial or ventricular
  33235	Removal of transvenous pacemaker electrode(s); dual lead system
  33236	Removal of permanent epicardial pacemaker and electrodes by thoracotomy; single lead system, atrial or ventricular
  33237	Removal of permanent epicardial pacemaker and electrodes by thoracotomy; dual lead system
  33238	Removal of permanent transvenous electrode(s) by thoracotomy
  33240	Insertion of implantable defibrillator pulse generator only; with existing single lead
  33241	Removal of implantable defibrillator pulse generator only
  33243	Removal of single or dual chamber implantable defibrillator electrode(s); by thoracotomy
  33244	Removal of implantable defibrillator pulse generator with replacement of implantable defibrillator pulse generator; by transvenous extraction
  33249	Insertion or replacement of permanent implantable defibrillator system, with transvenous lead(s), single or dual chamber
  33262	Removal of implantable defibrillator pulse generator with replacement of implantable defibrillator pulse generator; single lead system
  33263	Removal of implantable defibrillator pulse generator with replacement of implantable defibrillator pulse generator; dual lead system
  33264	Removal of implantable defibrillator pulse generator with replacement of implantable defibrillator pulse generator; multiple lead system
  33270	Insertion or replacement of permanent subcutaneous implantable defibrillator system, with subcutaneous electrode, including defibrillation threshold evaluation, induction of arrhythmia, evaluation of sensing for arrhythmia termination, and programming or reprogramming of sensing or therapeutic parameters, when performed
  33271	Insertion of subcutaneous implantable defibrillator electrode
  33272	Removal of subcutaneous implantable defibrillator electrode
  33273	Repositioning of previously implanted subcutaneous implantable defibrillator electrode
  55705	Biopsy, prostate; incisional, any approach
  55810	Prostatectomy, perineal radical
  55812	Prostatectomy, perineal radical; with lymph node biopsy(s) (limited pelvic lymphadenectomy)
  55815	Prostatectomy, perineal radical; with bilateral pelvic lymphadenectomy, including external iliac, hypogastric and obturator nodes
  55821	Prostatectomy (including control of postoperative bleeding, vasectomy, meatotomy, urethral calibration and/or dilation, and internal urethrotomy); suprapubic, subtotal, 1 or 2 stages
  55831	Prostatectomy (including control of postoperative bleeding, vasectomy, meatotomy, urethral calibration and/or dilation, and internal urethrotomy); retropubic, subtotal
  55840	Prostatectomy, retropubic radical, with or without nerve sparing;
  55842	Prostatectomy, retropubic radical, with or without nerve sparing; with lymph node biopsy(s) (limited pelvic lymphadenectomy)
  55845	Prostatectomy, retropubic radical, with or without nerve sparing; with bilateral pelvic lymphadenectomy, including external iliac, hypogastric, and obturator nodes
  55866	Laparoscopy, surgical prostatectomy, retropubic radical, including nerve sparing, includes robotic assistance, when performed
  33889	Open subclavian to carotid artery transposition performed in conjunction with endovascular repair of descending thoracic aorta, by neck incision, unilateral
  35501	Bypass graft, with vein; common carotid-ipsilateral internal carotid
  35506	Bypass graft, with vein; carotid-subclavian or subcalvian-carotid
  35508	Bypass graft, with vein; carotid-vertebral
  35509	Bypass graft, with vein; carotid-contralateral carotid
  35510	Bypass graft, with vein; carotid-brachial
  35511	Bypass graft, with vein; subclavian-subclavian
  35512	Bypass graft subclavian- brachial
  35515	Bypass graft subclavian-vertebral
  35516	Bypass graft, with vein; subclavian-axillary
  35518	Bypass graft, with vein; axillary-axillary
  35521	Bypass graft, with vein; axillary-femoral
  35522	Bypass graft, with vein; axillary-brachial
  35523	Bypass graft, with vein; brachial-ulnar or -radial
  35525	Bypass graft, with vein; brachial-brachial
  35533	Bypass graft, with vein; axillary-femoral-femoral
  35556	Bypass graft, with vein; femoral-popliteal
  35558	Bypass graft, with vein; femoral-femoral
  35566	Bypass graft, with vein; femoral-anterior tibial, posterior tibial, peroneal artery or other distal vessels
  35570	Bypass graft, with vein; tibial-tibial, peroneal-tibial, or tibial/peroneal trunk-tibial
  35571	Bypass graft, with vein; popliteal-tibial, -peroneal artery or other distal vessels
  35583	In-situ vein bypass; femoral-popliteal
  35585	In-situ vein bypass; femoral-anterior tibial, posterior tibial, or peroneal artery
  35587	In-situ vein bypass; popliteal-tibial, peroneal
  35616	Bypass graft, with other than vein; subclavian-axillary
  35621	Bypass graft, with other than vein; axillary-femoral
  35623	Bypass graft, with other than vein; axillary-popliteal or -tibial
  35650	Bypass graft, with other than vein; axillary-axillary
  35654	Bypass graft, with other than vein; axillary-femoral-femoral
  35656	Bypass graft, with other than vein; femoral-popliteal
  35661	Bypass graft, with other than vein; femoral-femoral
  35666	Bypass graft, with other than vein; femoral-anterior tibial, posterior tibial, or peroneal artery
  35671	Bypass graft, with other than vein; popliteal-tibial or -peroneal artery
  35686	Creation of distal arteriovenous fistula during lower extremity bypass surgery (non-hemodialysis)
  45110	Proctectomy; complete, combined abdominoperineal, with colostomy
  45111	Proctectomy; partial resection of rectum, transabdominal approach
  45112	Proctectomy, combined abdominoperineal, pull-through procedure (eg, colo-anal anastomosis)
  45113	Proctectomy, partial, with rectal mucosectomy, ileoanal anastomosis, creation of ileal reservoir (S or J), with or without loop ileostomy
  45114	Proctectomy, partial, with anastomosis; abdominal and transsacral approach
  45116	Proctectomy, partial, with anastomosis; transsacral approach only (Kraske type)
  45119	Proctectomy, combined abdominoperineal pull-through procedure (eg, colo-anal anastomosis), with creation of colonic reservoir (eg, J-pouch), with diverting enterostomy when performed
  45120	Proctectomy, complete (for congenital megacolon), abdominal and perineal approach; with pull-through procedure and anastomosis (eg, Swenson, Duhamel, or Soave type operation)
  45121	Proctectomy, complete (for congenital megacolon), abdominal and perineal approach; with subtotal or total colectomy, with multiple biopsies
  45126	Pelvic exenteration for colorectal malignancy, with proctectomy (with or without colostomy), with removal of bladder and ureteral transplantations, and/or hysterectomy, or cervicectomy, with or without removal of tube(s), with or without removal of ovary(s), or any combination thereof
  45395	Laparoscopy, surgical; proctectomy, complete, combined abdominoperineal, with colostomy
  45397	Laparoscopy, surgical; proctectomy, combined abdominoperineal pull-through procedure (eg, colo-anal anastomosis), with creation of colonic reservoir (eg, J-pouch), with diverting enterostomy, when performed
  45562	Exploration, repair, and presacral drainage for rectal injury
  45563	Exploration, repair, and presacral drainage for rectal injury; with colostomy
  57307	Closure of rectovaginal fistula; abdominal approach, with concomitant colostomy
  43496	Free jejunum transfer with microvascular anastomosis
  44010	Duodenotomy, for exploration, biopsy(s), or foreign body removal
  44020	Enterotomy, small intestine, other than duodenum; for exploration, biopsy(s), or foreign body removal
  44021	Enterotomy, small intestine, other than duodenum; for decompression (eg, Baker tube)
  44120	Enterectomy, resection of small intestine; single resection and anastomosis
  44125	Enterectomy, resection of small intestine; with enterostomy
  44126	Enterectomy, resection of small intestine for congenital atresia, single resection and anastomosis of proximal segment of intestine; without tapering
  44127	Enterectomy, resection of small intestine for congenital atresia, single resection and anastomosis of proximal segment of intestine; with tapering
  44130	Enteroenterostomy, anastomosis of intestine, with or without cutaneous enterostomy (separate procedure)
  44186	Laparoscopy, surgical; jejunostomy (eg, for decompression or feeding)
  44187	Laparoscopy, surgical; ileostomy or jejunostomy, non-tube
  44202	Laparoscopy, surgical; enterectomy, resection of small intestine, single resection and anastomosis
  44300	Enterostomy-External Fistulization of Intestines Procedures
  44310	Ileostomy or jejunostomy, non-tube
  44312	Revision of ileostomy; simple (release of superficial scar) (separate procedure)
  44314	Revision of ileostomy; complicated (reconstruction in-depth) (separate procedure)
  44316	Continent ileostomy (Kock procedure) (separate procedure)
  44602	Suture of small intestine (enterorrhaphy) for perforated ulcer, diverticulum, wound, injury or rupture; single perforation
  44603	Suture of small intestine (enterorrhaphy) for perforated ulcer, diverticulum, wound, injury or rupture; multiple perforations
  44615	Intestinal stricturoplasty (enterotomy and enterorrhaphy) with or without dilation, for intestinal obstruction
  44640	Closure of intestinal cutaneous fistula
  44650	Closure of enteroenteric or enterocolic fistula
  44800	Excision of Meckel's diverticulum (diverticulectomy) or omphalomesenteric duct
  45136	Excision of ileoanal reservoir with ileostomy
  38100	Splenectomy; total (separate procedure)
  38101	Splenectomy; partial (separate procedure)
  38102	Splenectomy; total, en bloc for extensive disease, in conjunction with other procedure (List in addition to code for primary procedure)
  38115	Repair of ruptured spleen (splenorrhaphy) with or without partial splenectomy
  38120	Laparoscopy, surgical, splenectomy
  19272	Excision of chest wall tumor involving ribs, with plastic reconstruction; with mediastinal lymphadenectomy
  20101	Exploration of penetrating wound (separate procedure); chest
  31770	Bronchoplasty; graft repair
  31775	Bronchoplasty; excision stenosis and anastomosis
  32096	Thoracotomy, with diagnostic biopsy(ies) of lung infiltrate(s) (eg, wedge, incisional), unilateral
  32097	Thoracotomy, with diagnostic biopsy(ies) of lung nodule(s) or mass(es) (eg, wedge, incisional), unilateral
  32100	Thoracotomy; with exploration
  32110	Thoracotomy; with control of traumatic hemorrhage and/or repair of lung tear
  32120	Thoracotomy; for postoperative complications
  32124	Thoracotomy; with open intrapleural pneumonolysis
  32140	Thoracotomy; with cyst(s) removal, includes pleural procedure when performed
  32141	Thoracotomy; with resection-plication of bullae, includes any pleural procedure when performed
  32151	Thoracotomy; with removal of intrapulmonary foreign body
  32200	Pneumonostomy, with open drainage of abscess or cyst
  32215	Pleural scarification for repeat pneumothorax
  32220	Decortication, pulmonary (separate procedure); total
  32225	Decortication, pulmonary (separate procedure); partial
  32310	Pleurectomy, parietal (separate procedure)
  32320	Decortication and parietal pleurectomy
  32440	Removal of lung, pneumonectomy;
  32442	Removal of lung, pneumonectomy; with resection of segment of trachea followed by broncho-tracheal anastomosis (sleeve pneumonectomy)
  32445	Removal of lung, pneumonectomy; extrapleural
  32480	Removal of lung, other than pneumonectomy; single lobe (lobectomy)
  32482	Removal of lung, other than pneumonectomy; 2 lobes (bilobectomy)
  32484	Removal of lung, other than pneumonectomy; single segment (segmentectomy)
  32486	Removal of lung, other than pneumonectomy; with circumferential resection of segment of bronchus followed by broncho-bronchial anastomosis (sleeve lobectomy)
  32488	Removal of lung, other than pneumonectomy; with all remaining lung following previous removal of a portion of lung (completion pneumonectomy)
  32491	Removal of lung, other than pneumonectomy; with resection-plication of emphysematous lung(s) (bullous or non-bullous) for lung volume reduction, sternal split or transthoracic approach, includes any pleural procedure, when performed
  32501	Resection and repair of portion of bronchus (bronchoplasty) when performed at time of lobectomy or segmentectomy (List separately in addition to code for primary procedure)
  32503	Resection of apical lung tumor (eg, Pancoast tumor), including chest wall resection, rib(s) resection(s), neurovascular dissection, when performed; without chest wall reconstruction(s)
  32504	Resection of apical lung tumor (eg, Pancoast tumor), including chest wall resection, rib(s) resection(s), neurovascular dissection, when performed; with chest wall reconstruction
  32505	Thoracotomy; with therapeutic wedge resection (eg, mass, nodule), initial
  32506	Thoracotomy; with therapeutic wedge resection (eg, mass or nodule), each additional resection, ipsilateral (List separately in addition to code for primary procedure)
  32507	Thoracotomy; with diagnostic wedge resection followed by anatomic lung resection (List separately in addition to code for primary procedure)
  32540	Extrapleural enucleation of empyema (empyemectomy)
  32553	Placement of interstitial device(s) for radiation therapy guidance (eg, fiducial markers, dosimeter), percutaneous, intrathoracic, single or multiple
  32607	Thoracoscopy; with diagnostic biopsy(ies) of lung infiltrate(s) (eg, wedge, incisional), unilateral
  32608	Thoracoscopy; with diagnostic biopsy(ies) of lung nodule(s) or mass(es) (eg, wedge, incisional), unilateral
  32609	Thoracoscopy; with biopsy(ies) of pleura
  32651	Thoracoscopy, surgical; with partial pulmonary decortication
  32652	Thoracoscopy, surgical; with total pulmonary decortication, including intrapleural pneumonolysis
  32655	Thoracoscopy, surgical; with resection-plication of bullae, includes any pleural procedure when performed
  32662	Thoracoscopy, surgical; with excision of mediastinal cyst, tumor, or mass
  32663	Thoracoscopy, surgical; with lobectomy (single lobe)
  32666	Thoracoscopy, surgical; with therapeutic wedge resection (eg, mass, nodule), initial unilateral
  32667	Thoracoscopy, surgical; with therapeutic wedge resection (eg, mass or nodule), each additional resection, ipsilateral (List separately in addition to code for primary procedure)
  32668	Thoracoscopy, surgical; with diagnostic wedge resection followed by anatomic lung resection (List separately in addition to code for primary procedure)
  32669	Thoracoscopy, surgical; with removal of a single lung segment (segmentectomy)
  32670	Thoracoscopy, surgical; with removal of two lobes (bilobectomy)
  32671	Thoracoscopy, surgical; with removal of lung (pneumonectomy)
  32672	Thoracoscopy, surgical; with resection-plication for emphysematous lung (bullous or non-bullous) for lung volume reduction (LVRS), unilateral includes any pleural procedure, when performed
  32800	Repair lung hernia through chest wall
  32815	Open closure of major bronchial fistula
  32905	Thoracoplasty, Schede type or extrapleural (all stages);
  32906	Thoracoplasty, Schede type or extrapleural (all stages); with closure of bronchopleural fistula
  32940	Pneumonolysis, extraperiosteal, including filling or packing procedures
  32960	Pneumothorax, therapeutic, intrapleural injection of air
  39000	Mediastinotomy with exploration, drainage, removal of foreign body, or biopsy; cervical approach
  39010	Mediastinotomy with exploration, drainage, removal of foreign body, or biopsy; transthoracic approach, including either transthoracic or median sternotomy
  39200	Resection of mediastinal cyst
  39220	Resection of mediastinal tumor
  39501	Repair, laceration of diaphragm, any approach
  39545	Imbrication of diaphragm for eventration, transthoracic or transabdominal, paralytic or nonparalytic
  39560	Resection, diaphragm; with simple repair (eg, primary suture)
  39561	Resection, diaphragm; with complex repair (eg, prosthetic material, local muscle flap)
  64746	Transection or avulsion of; phrenic nerve
  60000	Incision and drainage of thyroglossal duct cyst, infected
  60200	Excision of cyst or adenoma of thyroid, or transection of isthmus
  60210	Partial thyroid lobectomy, unilateral; with or without isthmusectomy
  60212	Partial thyroid lobectomy, unilateral; with contralateral subtotal lobectomy, including isthmusectomy
  60220	Total thyroid lobectomy, unilateral; with or without isthmusectomy
  60225	Total thyroid lobectomy, unilateral; with contralateral subtotal lobectomy, including isthmusectomy
  60240	Thyroidectomy, total or complete
  60252	Thyroidectomy, total or subtotal for malignancy; with limited neck dissection
  60254	Thyroidectomy, total or subtotal for malignancy; with radical neck dissection
  60260	Thyroidectomy, removal of all remaining thyroid tissue following previous removal of a portion of thyroid
  60270	Thyroidectomy, including substernal thyroid; sternal split or transthoracic approach
  60271	Thyroidectomy, including substernal thyroid; cervical approach
  60280	Excision of thyroglossal duct cyst or sinus
  60281	Excision of thyroglossal duct cyst or sinus; recurrent
  60500	Parathyroidectomy or exploration of parathyroid(s)
  60502	Parathyroidectomy or exploration of parathyroid(s); re-exploration
  60505	Parathyroidectomy or exploration of parathyroid(s); with mediastinal exploration, sternal split or transthoracic approach
  60512	Parathyroid autotransplantation (List separately in addition to code for primary procedure)
  51925	Closure of vesicouterine fistula; with hysterectomy
  58260	Vaginal hysterectomy, for uterus 250 g or less
  58262	Vaginal hysterectomy, for uterus 250 g or less; with removal of tube(s), and/or ovary(s)
  58263	Vaginal hysterectomy, for uterus 250 g or less; with removal of tube(s), and/or ovary(s), with repair of enterocele
  58267	Vaginal hysterectomy, for uterus 250 g or less; with colpo-urethrocystopexy (Marshall-Marchetti-Krantz type, Pereyra type) with or without endoscopic control
  58270	Vaginal hysterectomy, for uterus 250 g or less; with repair of enterocele
  58275	Vaginal hysterectomy, for uterus 250 g or less;
  58280	Vaginal hysterectomy, with total or partial vaginectomy; with repair of enterocele
  58285	Vaginal hysterectomy, radical (Schauta type operation)
  58290	Vaginal hysterectomy, for uterus greater than 250 g
  58291	Vaginal hysterectomy, for uterus greater than 250 g; with removal of tube(s) and/or ovary(s)
  58292	Vaginal hysterectomy, for uterus greater than 250 g; with removal of tube(s) and/or ovary(s), with repair of enterocele
  58293	Vaginal hysterectomy, for uterus greater than 250 g; with colpo-urethrocystopexy (Marshall-Marchetti-Krantz type, Pereyra type) with or without endoscopic control
  58294	Vaginal hysterectomy, for uterus greater than 250 g; with repair of enterocele
  62160	Neuroendoscopy, intracranial, for placement or replacement of ventricular catheter and attachment to shunt system or external drainage (List separately in addition to code for primary procedure)
  62180	Ventriculocisternostomy (Torkildsen type operation)
  62190	Creation of shunt; subarachnoid/subdural-atrial, -jugular, -auricular
  62192	Creation of shunt; subarachnoid/subdural-peritoneal, -pleural, other terminus
  62194	Replacement or irrigation, subarachnoid/subdural catheter
  62200	Ventriculocisternostomy, third ventricle;
  62201	Ventriculocisternostomy, third ventricle; stereotactic, neuroendoscopic method
  62220	Creation of shunt; ventriculo-atrial, -jugular, -auricular
  62223	Creation of shunt; ventriculo-peritoneal, -pleural, other terminus
  62225	Replacement or irrigation, ventricular catheter
  62230	Replacement or revision of cerebrospinal fluid shunt, obstructed valve, or distal catheter in shunt system
  62256	Removal of complete cerebrospinal fluid shunt system; without replacement
  62258	Removal of complete cerebrospinal fluid shunt system; with replacement by similar or other shunt at same operation
  20102	Exploration of penetrating wound (separate procedure); abdomen/flank/back
  35840	Exploration for postoperative hemorrhage, thrombosis or infection; abdomen
  39503	Repair, neonatal diaphragmatic hernia, with or without chest tube insertion and with or without creation of ventral hernia
  39540	Repair, diaphragmatic hernia (other than neonatal), traumatic; acute
  39541	Repair, diaphragmatic hernia (other than neonatal), traumatic; chronic
  43332	Repair, paraesophageal hiatal hernia (including fundoplication), via laparotomy, except neonatal; without implantation of mesh or other prosthesis
  43333	Repair, paraesophageal hiatal hernia (including fundoplication), via laparotomy, except neonatal; with implantation of mesh or other prosthesis
  44005	Enterolysis (freeing of intestinal adhesion) (separate procedure)
  44180	Laparoscopy, surgical, enterolysis (freeing of intestinal adhesion) (separate procedure)
  44700	Exclusion of small intestine from pelvis by mesh or other prosthesis, or native tissue (eg, bladder or omentum)
  44820	Excision of lesion of mesentery (separate procedure)
  44850	Suture of mesentery (separate procedure)
  49000	Exploratory laparotomy, exploratory celiotomy with or without biopsy(s) (separate procedure)
  49002	Reopening of recent laparotomy
  49010	Exploration, retroperitoneal area with or without biopsy(s) (separate procedure)
  49020	Drainage of peritoneal abscess or localized peritonitis, exclusive of appendiceal abscess, open
  49040	Drainage of subdiaphragmatic or subphrenic abscess, open
  49060	Drainage of retroperitoneal abscess, open
  49203	Excision or destruction, open, intra-abdominal tumors, cysts or endometriomas, 1 or more peritoneal, mesenteric, or retroperitoneal primary or secondary tumors; largest tumor 5 cm diameter or less
  49204	Excision or destruction, open, intra-abdominal tumors, cysts or endometriomas, 1 or more peritoneal, mesenteric, or retroperitoneal primary or secondary tumors; largest tumor 5.1-10.0 cm diameter
  49205	Excision or destruction, open, intra-abdominal tumors, cysts or endometriomas, 1 or more peritoneal, mesenteric, or retroperitoneal primary or secondary tumors; largest tumor greater than 10.0 cm diameter
  49215	Excision of presacral or sacrococcygeal tumor
  49220	Staging laparotomy for Hodgkin's disease or lymphoma (includes splenectomy, needle or open biopsies of both liver lobes, possibly also removal of abdominal nodes, abdominal node and/or bone marrow biopsies, ovarian repositioning)
  49250	Umbilectomy, omphalectomy, excision of umbilicus (separate procedure)
  49255	Omentectomy, epiploectomy, resection of omentum (separate procedure)
  49320	Laparoscopy, abdomen, peritoneum, and omentum, diagnostic, with or without collection of specimen(s) by brushing or washing (separate procedure)
  49321	 Laparoscopy, surgical; with biopsy (single or multiple)
  49324	Laparoscopy, surgical; with insertion of tunneled intraperitoneal catheter
  49325	Laparoscopy, surgical; with revision of previously placed intraperitoneal cannula or catheter, with removal of intraluminal obstructive material if performed
  49326	Laparoscopy, surgical; with omentopexy (omental tacking procedure) (List separately in addition to code for primary procedure)
  49402	Removal of peritoneal foreign body from peritoneal cavity
  49412	Placement of interstitial device(s) for radiation therapy guidance (eg, fiducial markers, dosimeter), open, intra-abdominal, intrapelvic, and/or retroperitoneum, including image guidance, if performed, single or multiple (List separately in addition to code for primary procedure)
  49419	Insertion of tunneled intraperitoneal catheter, with subcutaneous port (ie, totally implantable)
  49421	Insertion of tunneled intraperitoneal catheter for dialysis, open
  49425	Insertion of peritoneal-venous shunt
  49426	 Revision  of peritoneal-venous shunt
  49900	Suture, secondary, of abdominal wall for evisceration or dehiscence
  49905	Omental flap, intra-abdominal (List separately in addition to code for primary procedure)
  49906	Free omental flap with microvascular anastomosis
  58960	Laparotomy, for staging or restaging of ovarian, tubal, or primary peritoneal malignancy (second look), with or without omentectomy, peritoneal washing, biopsy of abdominal and pelvic peritoneum, diaphragmatic assessment with pelvic and limited para-aortic lymphadenectomy
`).map(buildProcedure);
