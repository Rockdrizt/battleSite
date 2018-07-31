<?xml version="1.0" encoding="UTF-8"?>
<data version="1.0">
    <struct type="Settings">
        <key>fileFormatVersion</key>
        <int>4</int>
        <key>texturePackerVersion</key>
<<<<<<< HEAD
        <string>4.8.3</string>
=======
        <string>4.8.2</string>
>>>>>>> 77ce159c9c112d688b6937caf58e19b6ce93bc0c
        <key>autoSDSettings</key>
        <array>
            <struct type="AutoSDSettings">
                <key>scale</key>
                <double>1</double>
                <key>extension</key>
                <string></string>
                <key>spriteFilter</key>
                <string></string>
                <key>acceptFractionalValues</key>
                <false/>
                <key>maxTextureSize</key>
                <QSize>
                    <key>width</key>
                    <int>-1</int>
                    <key>height</key>
                    <int>-1</int>
                </QSize>
            </struct>
        </array>
        <key>allowRotation</key>
        <false/>
        <key>shapeDebug</key>
        <false/>
        <key>dpi</key>
        <uint>72</uint>
        <key>dataFormat</key>
        <string>json-array</string>
        <key>textureFileName</key>
        <filename></filename>
        <key>flipPVR</key>
        <false/>
        <key>pvrCompressionQuality</key>
        <enum type="SettingsBase::PvrCompressionQuality">PVR_QUALITY_NORMAL</enum>
        <key>atfCompressData</key>
        <false/>
        <key>mipMapMinSize</key>
        <uint>32768</uint>
        <key>etc1CompressionQuality</key>
        <enum type="SettingsBase::Etc1CompressionQuality">ETC1_QUALITY_LOW_PERCEPTUAL</enum>
        <key>etc2CompressionQuality</key>
        <enum type="SettingsBase::Etc2CompressionQuality">ETC2_QUALITY_LOW_PERCEPTUAL</enum>
        <key>dxtCompressionMode</key>
        <enum type="SettingsBase::DxtCompressionMode">DXT_PERCEPTUAL</enum>
        <key>jxrColorFormat</key>
        <enum type="SettingsBase::JpegXrColorMode">JXR_YUV444</enum>
        <key>jxrTrimFlexBits</key>
        <uint>0</uint>
        <key>jxrCompressionLevel</key>
        <uint>0</uint>
        <key>ditherType</key>
        <enum type="SettingsBase::DitherType">NearestNeighbour</enum>
        <key>backgroundColor</key>
        <uint>0</uint>
        <key>libGdx</key>
        <struct type="LibGDX">
            <key>filtering</key>
            <struct type="LibGDXFiltering">
                <key>x</key>
                <enum type="LibGDXFiltering::Filtering">Linear</enum>
                <key>y</key>
                <enum type="LibGDXFiltering::Filtering">Linear</enum>
            </struct>
        </struct>
        <key>shapePadding</key>
        <uint>0</uint>
        <key>jpgQuality</key>
        <uint>80</uint>
        <key>pngOptimizationLevel</key>
        <uint>1</uint>
        <key>webpQualityLevel</key>
        <uint>101</uint>
        <key>textureSubPath</key>
        <string></string>
        <key>atfFormats</key>
        <string></string>
        <key>textureFormat</key>
        <enum type="SettingsBase::TextureFormat">png</enum>
        <key>borderPadding</key>
        <uint>0</uint>
        <key>maxTextureSize</key>
        <QSize>
            <key>width</key>
            <int>2048</int>
            <key>height</key>
            <int>2048</int>
        </QSize>
        <key>fixedTextureSize</key>
        <QSize>
            <key>width</key>
            <int>-1</int>
            <key>height</key>
            <int>-1</int>
        </QSize>
        <key>algorithmSettings</key>
        <struct type="AlgorithmSettings">
            <key>algorithm</key>
            <enum type="AlgorithmSettings::AlgorithmId">MaxRects</enum>
            <key>freeSizeMode</key>
            <enum type="AlgorithmSettings::AlgorithmFreeSizeMode">Best</enum>
            <key>sizeConstraints</key>
            <enum type="AlgorithmSettings::SizeConstraints">AnySize</enum>
            <key>forceSquared</key>
            <false/>
            <key>maxRects</key>
            <struct type="AlgorithmMaxRectsSettings">
                <key>heuristic</key>
                <enum type="AlgorithmMaxRectsSettings::Heuristic">Best</enum>
            </struct>
            <key>basic</key>
            <struct type="AlgorithmBasicSettings">
                <key>sortBy</key>
                <enum type="AlgorithmBasicSettings::SortBy">Best</enum>
                <key>order</key>
                <enum type="AlgorithmBasicSettings::Order">Ascending</enum>
            </struct>
            <key>polygon</key>
            <struct type="AlgorithmPolygonSettings">
                <key>alignToGrid</key>
                <uint>1</uint>
            </struct>
        </struct>
        <key>dataFileNames</key>
        <map type="GFileNameMap">
            <key>data</key>
            <struct type="DataFile">
                <key>name</key>
                <filename>atlas.json</filename>
            </struct>
        </map>
        <key>multiPack</key>
        <false/>
        <key>forceIdenticalLayout</key>
        <false/>
        <key>outputFormat</key>
        <enum type="SettingsBase::OutputFormat">RGBA8888</enum>
        <key>alphaHandling</key>
        <enum type="SettingsBase::AlphaHandling">ClearTransparentPixels</enum>
        <key>contentProtection</key>
        <struct type="ContentProtection">
            <key>key</key>
            <string></string>
        </struct>
        <key>autoAliasEnabled</key>
        <true/>
        <key>trimSpriteNames</key>
        <true/>
        <key>prependSmartFolderName</key>
        <false/>
        <key>autodetectAnimations</key>
        <true/>
        <key>globalSpriteSettings</key>
        <struct type="SpriteSettings">
            <key>scale</key>
            <double>1</double>
            <key>scaleMode</key>
            <enum type="ScaleMode">Smooth</enum>
            <key>extrude</key>
            <uint>1</uint>
            <key>trimThreshold</key>
            <uint>1</uint>
            <key>trimMargin</key>
            <uint>1</uint>
            <key>trimMode</key>
            <enum type="SpriteSettings::TrimMode">Trim</enum>
            <key>tracerTolerance</key>
            <int>200</int>
            <key>heuristicMask</key>
            <false/>
            <key>defaultPivotPoint</key>
            <point_f>0.5,0.5</point_f>
            <key>writePivotPoints</key>
            <false/>
        </struct>
        <key>individualSpriteSettings</key>
        <map type="IndividualSpriteSettingsMap">
            <key type="filename">light1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>38,117,75,233</rect>
                <key>scale9Paddings</key>
                <rect>38,117,75,233</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">light2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>37,121,75,243</rect>
                <key>scale9Paddings</key>
                <rect>37,121,75,243</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">light3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>34,34,67,67</rect>
                <key>scale9Paddings</key>
                <rect>34,34,67,67</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">name0.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>141,33,281,67</rect>
                <key>scale9Paddings</key>
                <rect>141,33,281,67</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">name1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>97,33,194,66</rect>
                <key>scale9Paddings</key>
                <rect>97,33,194,66</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">name2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>82,32,163,65</rect>
                <key>scale9Paddings</key>
                <rect>82,32,163,65</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">name3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>172,31,343,62</rect>
                <key>scale9Paddings</key>
                <rect>172,31,343,62</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">name4.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>109,33,219,65</rect>
                <key>scale9Paddings</key>
                <rect>109,33,219,65</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">name5.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>173,30,345,61</rect>
                <key>scale9Paddings</key>
                <rect>173,30,345,61</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">name6.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>172,29,344,58</rect>
                <key>scale9Paddings</key>
                <rect>172,29,344,58</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">name7.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>173,33,347,65</rect>
                <key>scale9Paddings</key>
                <rect>173,33,347,65</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">pinkLight.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>417,22,834,44</rect>
                <key>scale9Paddings</key>
                <rect>417,22,834,44</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">plat1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>54,26,108,51</rect>
                <key>scale9Paddings</key>
                <rect>54,26,108,51</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">plat2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>54,25,108,51</rect>
                <key>scale9Paddings</key>
                <rect>54,25,108,51</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">ready.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>155,58,309,115</rect>
                <key>scale9Paddings</key>
                <rect>155,58,309,115</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">star.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>16,16,32,32</rect>
                <key>scale9Paddings</key>
                <rect>16,16,32,32</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
<<<<<<< HEAD
            <key type="filename">teamBar1.png</key>
=======
            <key type="filename">teamBar0.png</key>
>>>>>>> 77ce159c9c112d688b6937caf58e19b6ce93bc0c
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
<<<<<<< HEAD
                <rect>200,36,401,72</rect>
                <key>scale9Paddings</key>
                <rect>200,36,401,72</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">teamBar2.png</key>
=======
                <rect>208,35,415,69</rect>
                <key>scale9Paddings</key>
                <rect>208,35,415,69</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">teamBar1.png</key>
>>>>>>> 77ce159c9c112d688b6937caf58e19b6ce93bc0c
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
<<<<<<< HEAD
                <rect>194,36,387,72</rect>
                <key>scale9Paddings</key>
                <rect>194,36,387,72</rect>
=======
                <rect>200,36,401,72</rect>
                <key>scale9Paddings</key>
                <rect>200,36,401,72</rect>
>>>>>>> 77ce159c9c112d688b6937caf58e19b6ce93bc0c
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">token0.png</key>
            <key type="filename">token1.png</key>
            <key type="filename">token2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>48,57,97,113</rect>
                <key>scale9Paddings</key>
                <rect>48,57,97,113</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">token3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>25,23,50,47</rect>
                <key>scale9Paddings</key>
                <rect>25,23,50,47</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">yogo0.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>37,42,73,84</rect>
                <key>scale9Paddings</key>
                <rect>37,42,73,84</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">yogo1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>41,47,81,93</rect>
                <key>scale9Paddings</key>
                <rect>41,47,81,93</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">yogo2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>41,46,81,91</rect>
                <key>scale9Paddings</key>
                <rect>41,46,81,91</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">yogo3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>44,44,87,87</rect>
                <key>scale9Paddings</key>
                <rect>44,44,87,87</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">yogo4.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>41,45,81,90</rect>
                <key>scale9Paddings</key>
                <rect>41,45,81,90</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">yogo5.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>52,46,104,91</rect>
                <key>scale9Paddings</key>
                <rect>52,46,104,91</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">yogo6.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>40,45,79,91</rect>
                <key>scale9Paddings</key>
                <rect>40,45,79,91</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">yogo7.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>47,43,94,86</rect>
                <key>scale9Paddings</key>
                <rect>47,43,94,86</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
        </map>
        <key>fileList</key>
        <array>
<<<<<<< HEAD
=======
            <filename>teamBar0.png</filename>
>>>>>>> 77ce159c9c112d688b6937caf58e19b6ce93bc0c
            <filename>teamBar1.png</filename>
            <filename>token1.png</filename>
            <filename>token0.png</filename>
            <filename>token2.png</filename>
            <filename>light1.png</filename>
            <filename>light2.png</filename>
            <filename>yogo6.png</filename>
            <filename>yogo0.png</filename>
            <filename>yogo4.png</filename>
            <filename>yogo7.png</filename>
            <filename>yogo1.png</filename>
            <filename>yogo2.png</filename>
            <filename>yogo3.png</filename>
            <filename>yogo5.png</filename>
            <filename>ready.png</filename>
            <filename>pinkLight.png</filename>
            <filename>light3.png</filename>
            <filename>token3.png</filename>
            <filename>star.png</filename>
            <filename>name0.png</filename>
            <filename>name1.png</filename>
            <filename>name2.png</filename>
            <filename>name3.png</filename>
            <filename>name4.png</filename>
            <filename>name5.png</filename>
            <filename>name6.png</filename>
            <filename>name7.png</filename>
            <filename>plat1.png</filename>
            <filename>plat2.png</filename>
<<<<<<< HEAD
            <filename>teamBar2.png</filename>
=======
>>>>>>> 77ce159c9c112d688b6937caf58e19b6ce93bc0c
        </array>
        <key>ignoreFileList</key>
        <array/>
        <key>replaceList</key>
        <array/>
        <key>ignoredWarnings</key>
        <array/>
        <key>commonDivisorX</key>
        <uint>1</uint>
        <key>commonDivisorY</key>
        <uint>1</uint>
        <key>packNormalMaps</key>
        <false/>
        <key>autodetectNormalMaps</key>
        <true/>
        <key>normalMapFilter</key>
        <string></string>
        <key>normalMapSuffix</key>
        <string></string>
        <key>normalMapSheetFileName</key>
        <filename></filename>
        <key>exporterProperties</key>
        <map type="ExporterProperties"/>
    </struct>
</data>
