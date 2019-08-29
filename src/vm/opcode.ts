enum Opcode{
 V_END =            0,

 PUSH_FLOAT =       1,
_PUSH_FLOAT =       2,

 vmPUSH_LONG =      3,
vm_PUSH_LONG =      4,
vmPUSH_LONG_const = 5,

PUSH_FLOAT_const =  6,

PUSH_DATA =         7, // ?
PUSH_DATA_ =        8, // ?
PUSH_DATA_const =   9, // ?

//***************************************************************
// POP комманды
//***************************************************************

_POP_FLOAT_OLD =    10,
_POP_FLOAT =        11,

vm_POP_LONG_OLD =   12,
vm_POP_LONG =       13,

 POP_DATA =         14,
_POP_DATA =         15,

FLOAT_TO_LONG =     16,
LONG_TO_FLOAT =     17,

V_ADD_F =           18,
V_SUB_F =           19,
V_DIV_F =           20,
V_MUL_F =           21,
V_MOD =             22,

V_TAN =             23,
V_ATAN =            24,
V_SIN =             25,
V_ASIN =            26,
V_COS =             27,
V_ACOS =            28,

V_LN =              29,    // 1
V_LG =              30,    // 1
V_LOG =             31,    // 2
V_STEPEN =          32,    // 2

V_EXP =             33,    // 1
V_SQRT =            34,    // 1
V_SQR =             35,    // 1
V_ED =              36,    // 1
V_DELTA =           37,    // 1

V_MAX =             38,    // 2
V_MIN =             39,    // 2
V_AVERAGE =         40,    // 2

V_ROUND =           41,    // 2

V_RANDOM =          42,    // 1

V_AND =             43,    // 2
V_OR =              44,    // 2
V_NOT =             45,    // 1

V_ABS =             46,    //1

V_SGN =             47,    //1
V_RAD =             48,    //1
V_DEG =             49,    //1
V_STOP =            50,    //1

V_JMP =             51,    //0
V_JNZ =             52,    //1
V_JZ =              53,    //1

V_EQUAL =           54,
V_NOTEQUAL =        55,
V_MORE =            56,
V_MOREorEQUAL =     57,
V_LOW =             58,
V_LOWorEQUAL =      59,

V_MCREATE =         60,    //6
V_MDELETE =         61,    //2
V_MFILL =           62,    //3
V_MGET =            63,    //4
V_MPUT =            64,    //5
V_MEDITOR =         65,    //2
V_MDIAG =           66,    //3

V_MADDX =           67,    //3
V_MSUBX =           68,    //3
V_MDIVX =           69,    //3
V_MMULX =           70,    //3

V_MDET =            71,    //2
V_MDELTA =          72,    //2
V_MED =             73,    //2

V_TRANSP =          74,    //3
V_MADDC =           75,    //4
V_MNOT =            76,    //2
V_MSUM =            77,    //2

V_MSUBC =  78, //4 (int Q1,int Q2,int Q3);
V_MMULC =  79, //4 (int Q1,int Q2,int Q3);

V_TRUNC =  80,    // 2
//V_BIG_SUB = 81,
V_CLOSEALL = 81,
V_EQUALI =    82,
V_NOTEQUALI = 83,

V_EDI =       84,
V_ANDI =      85,
V_ORI =       86,
V_NOTI =      87,
V_NOTbin =    88,
VM_SETCRDSYSTEM = 89,
V_MDIVC = 90, //4 MDivC(int Q1,int Q2,int Q3);
V_MMUL =  91, //4 MMul(int Q1,int Q2,int Q3);
V_MGLUE = 92, //6 MGlue(int Q1,int Q2,int Q3,long y,long x);
V_MCUT =  93, //7 MCut(int Q1,int Q2,long y,long x,long sy,long sx);
V_MMOVE = 94, //4 MMove(int Q,long y,long x);
V_MOBR =  95, //3 MObr(int Q1,int Q2);
V_MDIM =   96,

V_XOR =   97,
V_XORBIN = 98,


V_FOLDERDIALOG = 99,
V_MSAVEAS = 100, //3
V_MLOAD =   101, //3
V_SAVEDIALOG =  102,
V_LOADDIALOG =  103,
V_CREATEOBJECTFROMFILE = 104,

V_AND_BINARY =       105,
V_OR_BINARY =        106,
//V_NOT =             45,

V_QUITSC =           107,

POP_FLOAT_PTR =      108,
PUSH_FLOAT_PTR =     109,

V_JNZ_HANDLE =       110,
V_JZ_HANDLE =        111,
SETSTATUSTEXT =      112,
V_UN_MINUS =         113,
V_STRINGEX =         114,
GETTICKCOUNT =       115,

V_SHR =              116,
V_SHL =              117,
SCHANGE =            119,
PUSH_STRING =        120,
_PUSH_STRING =       121,
PUSH_STRING_CONST =  122,
_POP_STRING =        123,

PLUS_STRING =        124,
LEFT_STRING =        125,
RIGHT_STRING =       126,
SUBSTR_STRING =      127,
POS_STRING =         128,
REPLICATE_STRING =   129,
LOWER_STRING =       130,
UPPER_STRING =       131,
ANSI_TO_OEM_STRING = 132,
OEM_TO_ANSI_STRING = 133,
COMPARE_STRING =     134,
COMPAREI_STRING =    135,
LENGTH_STRING =      136,
LTRIM_STRING =       137,
RTRIM_STRING =       138,
ALLTRIM_STRING =     139,
ASCII_STRING =       140,
CHR_STRING =         141,
FLOAT_TO_STRING =    142,
STRING_TO_FLOAT =    143,

S_EQUAL =            144,
S_NOTEQUAL =         145,
S_MORE =             146,
S_MOREorEQUAL =      147,
S_LOW =              148,
S_LOWorEQUAL =       149,
RGB_COLOR =          150,


V_SYSTEM =           151,
V_SYSTEMSTR =        152,

V_REGISTEROBJECT =   153,
V_UNREGISTEROBJECT = 154,
V_SETCAPTURE =       155,
V_RELEASECAPTURE =   156,
_POP_STRING_OLD =    157,
VM_GETMOUSEPOS =     158,
vm_INPUT_BOX =       159,
MESSAGE_BOX =        160,

V_CREATESTREAM =     161,
V_CLOSESTREAM =      162,
V_SEEK =             163,
V_STREAMSTATUS =     164,
V_EOF =              165,
V_GETPOS =           167,
V_GETSIZE =          168,
V_SETWIDTH =         169,
V_FREAD =            170,
V_SREAD =            171,
V_FWRITE =           172,
V_SWRITE =           173,
V_GETLINE =          174,
V_COPYBLOCK =        175,
V_TRUNCATE =         176,

V_RANDOMIZE =        177,

V_CREATEFROMFILE3D = 197,
WINSHELL =           198,
RGB_COLORex =        199,
LOADSPACEWINDOW =    200,
OPENSCHEMEWINDOW =   201,
CLOSEWINDOW =        202,
V_GETNAMEBYHSP =     203,
V_GETHSPBYNAME =     204,
V_SETCLIENTSIZE =    205,

SETWINDOWTITLE =     206,
GETWINDOWTITLE =     207,
SHOWWINDOW =         208,
SETWINDOWPOS =       209,
SETWINDOWORG =       210,
SETWINDOWSIZE =      211,
ISWINDOWVISIBLE =    212,
ISICONIC =           213,
ISWINDOWEXIST =      214,
BRINGWINDOWTOTOP =   215,
CASCADEWINDOWS =     216,
TILE =               217,
ARRANGEICONS =       218,

WIN_ORGX =           219,
WIN_ORGY =           220,
WIN_SIZEX =          221,
WIN_SIZEY =          222,

GETOBJECTHANDLE =    223,
GETOBJECTBYNAME =    224,

GETCLIENTWIDTH =     225,
GETCLIENTHEIGHT =    226,
CHOSECOLORDIALOG =   227,

JGETX =              228,
JGETY =              229,
JGETZ =              230,
JGETBTN =            231,
GETAKEYSTATE =       232,

GETCLASSDIR =        233,
GETPROJECTDIR =      234,
GETWINDOWSDIR =      235,
GETSYSTEMDIR =       236,
GETDIRFROMFILE =     237,
ADDSLASH =           238,
GETSTRATUMDIR =      239,
WINEXECUTE =         240,
SETSCROLLRANGE =     241,

VM_GETACTUALWIDTH =  242,
VM_GETACTUALHEIGHT = 243,
VM_SAVEIMAGE =       244,
V_LOCK2D =           245,
VM_LOADMENU =        246,
VM_DELETEMENU =      247,
REGISTEROBJECTS =    248,
UNREGISTEROBJECTS =  249,


// MCI
MCISENDSTRING =      250,
MCISENDSTRING_INT =  251,
MCISENDSTRINGEX =    252,
GETLASTMCIERROR =    253,
GETMCIERROR =        254,
VM_SETCALCORDER =    255,
VM_GETCALCORDER =    256,

VM_GETOBJECT3DFROMPOINT2D =   296,
VM_SWEEPEXTRUDE =    297,
V_ISINTERSECT2D =    298,
SETARROW2D =         299,
CREATELINE2D =       300,
ADDPOINT2D =         301,
DELPOINT2D =         302,
GETBRUSHOBJECT2D =   303,
GETPENOBJECT2D =     304,
GETRGNCREATEMODE =   305,
GETVECTORNUMPOINTS2D = 306,
GETVECTORPOINT2DX =  307,
GETVECTORPOINT2DY =  308,
SETBRUSHOBJECT2D =   309,
SETPENOBJECT2D =     310,
SETRGNCREATEMODE =   311,
SETVECTORPOINT2D =   312,
CREATEPEN2D =        313,
GETPENCOLOR2D =      314,
GETPENROP2D =        315,
GETPENSTYLE2D =      316,
GETPENWIDTH2D =      317,
SETPENCOLOR2D =      318,
SETPENROP2D =        319,
SETPENSTYLE2D =      320,
SETPENWIDTH2D =      321,
DELETETOOL2D =       322,
DELETEOBJECT2D =     323,
GETOBJECTORG2DX =    324,
GETOBJECTORG2DY =    325,
GETOBJECTPARENT2D =  326,
GETOBJECTANGLE2D =   327,
GETOBJECTSIZE2DX =   328,
GETOBJECTSIZE2DY =   329,
GETOBJECTTYPE =      330,
SETOBJECTORG2D =     331,
SETOBJECTSIZE2D =    332,
CREATEBRUSH2D =      333,
SETPOINTS2D =        334,

CREATEDID2D =        335,
CREATEDOUBLEDID2D =  336,
CREATERDID2D =       337,
CREATERDOUBLEDID2D = 338,
CREATEBITMAP2D =     339,
CREATEDOUBLEBITMAP2D = 340,
GETSPACEORGY =       341,
GETSPACEORGX =       342,
SETSPACEORG2D =      343,
SETSCALESPACE2D =    344,
GETSCALESPACE2D =    345,
SNDPLAYSOUND =       346,

GETBOTTOMOBJECT2D =      347,
GETUPPEROBJECT2D =       348,
GETOBJECTFROMZORDER2D =  349,
GETLOWEROBJECT2D =       350,
GETTOPOBJECT2D =         351,
GETZORDER2D =            352,
OBJECTTOBOTTOM2D =       353,
OBJECTTOTOP2D =          354,
SETZORDER2D =            355,
SWAPOBJECT2D =           356,
SETBITMAPSRCRECT =       357,

SETOBJECTATTRIBUTE2D =   358,
GETOBJECTATTRIBUTE2D =   359,

CREATEFONT2D =           360,
CREATESTRING2D =         361,
CREATETEXT2D =           362,
CREATERASTERTEXT2D =     363,
SETSHOWOBJECT2D =        364,
SETLOGSTRING2D =         365,

ADDGROUPITEM2D =         366,
CREATEGROUP2D =          367,
DELETEGROUP2D =          368,
DELGROUPITEM2D =         369,
GETGROUPITEM2D =         370,
GETGROUPITEMS2D =        371,
GETGROUPITEMSNUM2D =     372,
ISGROUPCONTAINOBJECT2D = 373,
SETGROUPITEM2D =         374,
SETGROUPITEMS2D =        375,
COPYTOCLIPBOARD2D =      376,
PASTEFROMCLIPBOARD2D =   377,
GETOBJECTNAME2D =        378,
SETOBJECTNAME2D =        379,
GETOBJECTFROMPOINT2D =   380,
GETLASTPRIMARY =         381,
ROTATEOBJECT2D =         382,
SHOWOBJECT2D =           383,
HIDEOBJECT2D =           384,
STDHYPERJUMP =           385,
GETCHILDCOUNT =          386,
GETCHILDIDBYNUM =        387,
GETCHILDCLASS =          389,

VM_CREATECONTROL2D =     390,
VM_GETCONTROLTEXT =      391,
VM_SETCONTROLTEXT =      392,
VM_CHECKDLGBUTTON =      393,
VM_ISDLGBUTTONCHECKED =  394,
VM_ENABLECONTROL =       395,
SETBRUSHHATCH2D =        396,
GETLOGSTRING2D =         397,
V_GETCLASS =             398,

MESSAGE =                400,

GETBRUSHCOLOR2D =        401,
GETBRUSHROP2D =          402,
GETBRUSHDIB2D =          403,
GETBRUSHSTYLE2D =        404,
GETBRUSHHATCH2D =        405,
SETBRUSHCOLOR2D =        406,
SETBRUSHROP2D =          407,
SETBRUSHDIB2D =          408,
SETBRUSHSTYLE2D =        409,

VM_ADDCHILDREN =         410,
VM_REMOVECHILDREN =      411,
VM_CREATECLASS =         412,
VM_DELETECLASS =         413,
VM_OPENCLASSSCHEME =     414,
VM_CLOSECLASSSCHEME =    415,
VM_CREATELINK =          416,
VM_SETLINKVARS =         417,
VM_REMOVELINK =          418,
VM_GETUNIQUCLASSNAME =   419,

V_GETSCHEMEOBJECT =      420,
V_CREATEWINDOWEX =       421,
V_GETVARF =              430,
V_GETVARS =              431,
V_GETVARH =              432,

V_SETVARF =              433,
V_SETVARS =              434,
V_SETVARH =              435,

VM_CREATELINK2 =         436,
VM_SETMODELTEXT =        437,
VM_GETMODELTEXT =        438,
VM_GETANGLEBYXY =        439,
GETOBJECTFROMPOINT2DEX = 440,

VM_OPENVIDEO =          441,
VM_CLOSEVIDEO =         442,
VM_CREATEVIDEOFRAME2D = 446,
VM_VIDEOSETPOS =        447,
VM_FRAMESETPOS2D =      448,
VM_VIDEOPLAY2D =        449,
VM_VIDEOPAUSE2D =       450,
VM_VIDEORESUME2D =      451,
VM_VIDEOSTOP2D =        452,
VM_SETVIDEOSRC2D =      453,
VM_VIDEOGETPOS =        454,
VM_FRAMEGETPOS =        455,
VM_FRAMEGETHVIDEO =     456,
VM_BEGINWRITEVIDEO =         457,
VM_VIDEOCOMPRESSDIALOG = 458,
VM_WRITEFRAME =          459,
SETCONTROLSTYLE2D =     460,
GETCONTROLSTYLE2D =     461,
LBADDSTRING =           462,
LBINSERTSTRING =        463,
LBGETSTRING =           464,
LBCLEARLIST =           465,
LBDELETESTRING =        466,
LBGETCOUNT =            467,
LBGETSELINDEX =         468,
LBSETSELINDEX =         469,
LBGETCARETINDEX =       470,
LBSETCARETINDEX =       471,
LBFINDSTRING =          472,
LBFINDSTRINGEXACT =     473,
GETPIXEL2D =            474,

VM_GETTIME =            475,
PUSHPTR =               476, // <- не трогать номер, а то сглючит компилер !!!!
PUSHPTRNEW =            477, // <- не трогать номер, а то сглючит компилер !!!!

VFUNCTION =             478,
DLLFUNCTION =           479,
GETELEMENT =            480,
SETELEMENT =            481,
EMPTYSPACE2D =          482,
CREATEPOLYLINE2D =      485,
VM_GETNAMEBYHANDLE =    486,

V_SETSPACELAYERS =      487,
V_GETSPACELAYERS =      488,
V_GETOBJECTLAYER2D =    489,
V_SETOBJECTLAYER2D =    490,
VM_SCMESSAGE =          491,
VM_SETVARTODEF =        492,
GETTEXTOBJECT2D =       493,
GETTEXTSTRING2D =       494,
GETTEXTFONT2D =         495,
VM_LOADOBJECTSTATE =    496,
VM_SAVEOBJECTSTATE =    497,
VM_GETWINDOWPROP =      498,
VM_CAMERAPROC =         499,


DB_OPENBASE =            500,
DB_OPENTABLE =           501,
DB_CLOSEBASE =           502,
DB_CLOSETABLE =          503,
DB_GETERROR =            504,
DB_GETERRORSTR =         505,
DB_SETDIR =              506,
DB_CLOSEALLBASES =       507,
DB_GOTOP =               508,
DB_GOBOTTOM =            509,
DB_SKIP =                510,
DB_GETFID =              511,
DB_GETFSTR =             512,
DB_SELECT =              513,
DB_GETCOUNT =            514,
DB_BROWSE =              515,
DB_GETDOUBLE =           516,
DB_GETFNAME =            517,
DB_GETFTYPE =            518,
DB_INSERTRECORD =        519,
DB_APPENDRECORD =        520,
DB_DELETERECORD =        521,
DB_SETFIELD =            522,
DB_SETFIELDNUM =         523,

DB_SSETFIELD =           524,
DB_SSETFIELDNUM =        525,
DB_SGETDOUBLE =          526,
DB_SGETFSTR =            527,

DB_CREATETABLE =         528,
DB_ZAP =                 529,


DB_ADDINDEX =            530, // by AK
DB_DELETEINDEX =         531, // by AK
DB_OPENINDEX =           532, // by AK
DB_SWITCHTOINDEX =       533, // by AK
DB_CLOSEINDEX =          534, // by AK
DB_REGENINDEX =          535, // by AK

DB_READBLOB =            536,
DB_WRITEBLOB =           537,
DB_FREEBLOB =            538,
DB_PACKTABLE =           539,
DB_SORTTABLE =           540,

DB_GETDELMODE =          541,
DB_SETDELMODE =          542,
DB_SETCODEPAGE =         543,
DB_GETCODEPAGE =         544,
DB_LOCK =                545,
DB_UNLOCK =              546,
DB_UNDELETE =            547,
DB_COPYTO =              548,
DB_SETTOKEY =            549,
DB_GETFCOUNT =           550,
DB_SETWINTABLE =         580,
DB_SETCONTROLTABLE =     581,
DB_RECNO =               582,


VM_BDEMIN =        500,
VM_BDEMAX =        599,


VM_SENDMESSAGE = 600,
VM_SETIMAGENAME = 601,
VM_SETLOGTEXT2D = 602,
GETTEXTFG2D =     603,
GETTEXTBK2D =     604,

VM_DIALOG =       605,
VM_DIALOGEX =     606,
VM_GETLINK =      607,
VM_DIALOGEX2 =    608,

VM_GETRVALUE =    609,
VM_GETGVALUE =    610,
VM_GETBVALUE =    611,

VM_GETTOOLREF2D = 612,
VM_GETNEXTTOOL2D = 613,
VM_GETNEXTOBJECT = 614,

VM_GETOBJECTPOINT3D =  635,
VM_SETOBJECTPOINT3D =  636,
VM_SETPRIMITIVE3D =    637,
VM_CREATEOBJECT3D =      638,
VM_DELPRIMITIVE3D =      639,
VM_GETNUMPRIMITIVES3D =  640,
VM_ADDPRIMITIVE3D =      641,
VM_DELPOINT3D =          642,
VM_GETNUMPOINTS3D =      643,
VM_ADDOBJECTPOINT3D =    644,

VM_SETMATRIX3D =       645,
VM_GETMATRIX3D =       646,
VM_TRANSFORMPOINTS3D = 647,
VM_ROTATEPOINTS3D =    648,
VM_GETOBJECTBASE3D =   649,
VM_SETOBJECTBASE3D =   650,
VM_GETBASE3D_2 =       651,
VM_GETSPACE3D =        652,
VM_GETDIM3D =          653,
VM_TRANSFORM3D =       654,
VM_ROTATE3D =          655,
VM_SETCOLOR3D =         656,
VM_CREATEDEFCAMERA3D =  657,
VM_SWITCHTOCAMERA3D =   658,
VM_GETACTIVECAMERA3D =  659,
VM_CREATESPACE3D =      660,
VM_DELETESPACE3D =      661,
VM_CREATEPROJECTION =   662,
VM_GETPOINTS3D =        663,
VM_SETPOINTS3D =        664,
VM_GETCOLOR3D =        665,

VM_SETCURRENTOBJ2D =    666,
VM_GETCURRENTOBJ2D =    667,
VM_MAKEFACE3D =         668,
VM_FITTOCAMERA3D =      669,
VM_CREATEMATERIAL =     670,

PUSHCRDSYSTEM3D =       671,
POPCRDSYSTEM3D =        672,
SELECTLOCALCRD3D =      673,
SELECTWORLDCRD3D =      674,
SELECTVIEWCRD3D =       675,
VM_TRCAMERA3D =         676,
VM_SETCOLORS3D =        677,
VM_GETCOLORS3D =        678,
VM_GETMATERIALs =       679, // get by name
VM_new =                700,
VM_delete =             701,
VM_VCLEARALL =          702,
VM_VINSERT =            703,
VM_VDELETE =            704,
VM_VGETCOUNT =          705,
VM_VGETTYPE =           706,
VM_VGETf =              707,
VM_VGETs =              708,
VM_VGETh =              709,
VM_VSETf =              710,
VM_VSETs =              711,
VM_VSETh =              712,
VM_GETCONTROLTEXTH =    713,
VM_SETCONTROLTEXTH =    714,

VM_LOADPROJECT =        720,
VM_UNLOADPROJECT =      721,
VM_SETACTIVEPROJECT =   722,
VM_ISPROJECTEXIST =     723,
VM_EXECUTEPROJECT =     724,
VM_SETPROJECTPROP =     725,
VM_GETPROJECTPROP =     726,
VM_GETPROJECTPROPS =    727,
VM_APPLYTEXTUTRE =      728,
VM_REMOVETEXTURE =      729,
VM_CREATEDIR =          730,
VM_DELETEDIR =          731,
VM_FILERENAME =         732,
VM_FILECOPY =           733,
VM_FILEEXIST =          734,
VM_FILEDELETE =         735,
VM_GETFILELIST =        736,
VM_GETACTUALSIZE =      737,
VM_SETBKBRUSH =         738,
VM_GETBKBRUSH =         739,

VM_DIFF1 =                    740,
VM_EQUATION =                 741,
VM_DIFF2 =                742,
VM_DEQUATION =            743,
VM_GETDIBOBJECT2D =    744,
VM_SETDIBOBJECT2D =    745,
VM_GETDDIBOBJECT2D =   746,
VM_SETDDIBOBJECT2D =   747,
VM_GETDATE =           748,
VM_VIDEOGETMARKER =    749,
VM_GETVARINFO =        750,
VM_GETVARCOUNT =       751,
VM_VSTORE =            752,
VM_VLOAD =             753,
GETBITMAPSRCRECT =     754,
VM_SETHYPERJUMP =      755,

SETRDIB2D =            756,
SSETRDDIB2D =          757,
GETRDIB2D =            758,
GETRDDIB2D =           759,

V_MSORT =              760,    //new
VM_DUPLICATEOBJECT3D = 761,
VM_CHECKMENU =         762,
VM_ENABLEMENU =        763,



//Добавил Марченко С.В.
PLUS_STRING_FLOAT =    770,
PLUS_FLOAT_STRING =    771,
VM_GETSCREENWIDTH =    772,
VM_GETSCREENHEIGHT =   773,

VM_GETWORKAREAX =             774,
VM_GETWORKAREAY =         775,
VM_GETWORKAREAWIDTH =  776,
VM_GETWORKAREAHEIGHT = 777,

VM_GETKEYBOARDLAYOUT = 778,
VM_SUBSTR1_STRING =    779,

VM_SETBRUSHOBJECT2D_HANDLE =  780,  //нужны для поддержки старых версий проектов
VM_SETPENOBJECT2D_HANDLE =    781,

VM_SETWINDOWTRANSPARENT =            782,
VM_SETWINDOWTRANSPARENT_H =          793,
VM_SETWINDOWTRANSPARENTCOLOR =   783,
VM_SETWINDOWTRANSPARENTCOLOR_H =     794,

VM_SETWINDOWREGION =             784,
VM_SETWINDOWREGION_H =           795,

VM_GETTITLEHEIGHT =              785,
VM_GETSMALLTITLEHEIGHT =     786,

VM_GETFIXEDFRAMEHEIGHT =     787,
VM_GETFIXEDFRAMEWIDTH =      788,
VM_GETSIZEFRAMEHEIGHT =      789,
VM_GETSIZEFRAMEWIDTH =           790,

VM_WINDOWINTASKBAR_H =           791,
VM_WINDOWINTASKBAR_S =           792,

VM_SHOWCURSOR =                      796,

VM_SCREENSHOT =                      797,
VM_SCREENSHOT_FULL =             842,
VM_SCREENSHOT_DESKTOP =        844,
VM_SCREENSHOT_DESKTOP_FULL = 845,

VM_LOCKOBJECT2D =                    798,
VM_GETVARINFOFULL =              799,

VM_INCREMENT_AFTER =             800,

VM_SENDSMS =                             841,
VM_SENDMAIL =                        843,

VM_GETFONTNAME2D =                   846,
VM_GETFONTSIZE2D =                   847,
VM_GETTEXTCOUNT2D =                  848,
VM_GETFONTSTYLE2D =                  849,
VM_SETFONTSIZE2D =                   850,
VM_SETFONTSTYLE2D =                  851,
VM_SETFONTNAME2D =                   852,

VM_GETTEXTSTRING2D_I =           853,
VM_GETTEXTFONT2D_I =             854,
VM_GETTEXTFG2D_I =               855,
VM_GETTEXTBG2D_I =               856,

VM_SETTEXTSTRING2D_I =           857,
VM_SETTEXTFONT2D_I =                 858,
VM_SETTEXTFG2D_I =                   859,
VM_SETTEXTBG2D_I =                   860,
VM_SETTEXT2D_I =                         861,

VM_CREATEFONT2DPT =                  862,

VM_SETSTANDARTCURSOR =           863,
VM_SETSTANDARTCURSOR_S =     864,
VM_LOADCURSOR =                          865,
VM_LOADCURSOR_S =                        866,

VM_INC =                                 867,
VM_INC_STEP =                            868,
VM_DEC =                                 869,
VM_DEC_STEP =                            870,
VM_LIMIT =                               871,

VM_GETFONTLIST =                 872,

VM_VSORT =                               873,
VM_VSORT_ASC =                       874,
VM_VSORT_DIFFERENT =                              875,

VM_GETUSERKEYVALUE =                              876,
VM_GETUSERKEYFULLVALUE =                          877,
VM_SENDUSERRESULT =                              879,
VM_COPYUSERRESULT =                               880,
VM_USERKEYISAUTORIZED =                           889,
VM_USERKEYISAUTORIZED_UK =                        890,

VM_READUSERKEY =                                 883,
VM_READPROJECTKEY =                               888,
VM_GETUSERKEYVALUE_UK =                           884,
VM_GETUSERKEYFULLVALUE_UK =                       885,
VM_SENDUSERRESULT_UK =                            886,
VM_COPYUSERRESULT_UK =                            887,

VM_GETTEMPDIRECTORY =                878,

VM_GETROMDRIVENAMES =                881,

VM_SHELLWAIT =                               882,

VM_SETCONTROLFONT =                              1101,
VM_SETCONTROLTEXTCOLOR =                          1102,
VM_GETCONTROLTEXTLENGTH =                         1103,
VM_GETCONTROLTEXTPART =                           1104,
VM_ADDCONTROLTEXT =                              1105,
VM_INSERTCONTROLTEXT =                            1106,

VM_SETWINDOWOWNER =                              1107,
VM_SETWINDOWPARENT =             1108,

VM_GETPROJECTCLASSES =                            1109,
VM_GETCLASSFILE =                                 1110,

VM_INSERTTEXT2D =                                1111,
VM_REMOVETEXT2D =                                 1112,
VM_ADDTEXT2D =                                    1113,

VM_LBGETSELINDEXS =                               1114,

VM_SETSTRINGBUFFERMODE =                          1115,

VM_SETMODELTEXTWITHOUTERROR =                     1116,

VM_SENDSMSWAIT =                                 1117,
VM_SENDMAILWAIT =                                1118,

VM_SETCONTROLFOCUS =                 1119,

VM_DBSQLH =                                       1120,

VM_SETOBJECTALPHA2D =                1121,
VM_GETOBJECTALPHA2D =                1122,

VM_SETBRUSHPOINTS2D =                1123,
VM_SETBRUSHCOLORS2D =                1124,

VM_SETPIXEL2D =                  1125,

VM_ENCRYPTSTREAM =                   1126,
VM_SENDDATA =                                     1127,
VM_DECRYPTSTREAM =                               1128,

VM_ROUNDT =                          1129,

VM_SETSPACERENDERERENGINE2D = 1130,

//Audio

VM_AUDIOOPENDEVICE =      801,
VM_AUDIOOPENSOUND =           802,
VM_AUDIOPLAY =                    803,
VM_AUDIOSTOP =                    804,
VM_AUDIOISPLAYING =           805,
VM_AUDIORESET =                   806,
VM_AUDIOSETREPEAT =           807,
VM_AUDIOGETREPEAT =           808,
VM_AUDIOSETVOLUME =           809,
VM_AUDIOGETVOLUME =           810,
VM_AUDIOSETBALANCE =      811,
VM_AUDIOGETBALANCE =      812,
VM_AUDIOSETTONE =             813,
VM_AUDIOGETTONE =             814,
VM_AUDIOISSEEKABLE =      815,
VM_AUDIOSETPOSITION =     816,
VM_AUDIOGETPOSITION =     817,
VM_AUDIOGETLENGTH =           818,
VM_AUDIODELETESOUND =     819,
VM_AUDIODELETEDEVICE =    820,

//Последний занятый номер - 1130
//801..830 определены в файле audio\scaudio.h
//831..840 - 891..899 определены в файле TextAnalyser\TextAnalyser.h
//900..1100 и 1200..1500 определены в 3d движке Панькова Д.
//1501..1600 NUI.h


VM_MAXIMUM_code =  1600,    // макcимальное количество функций виртуальной машины
}
export {
    Opcode
}