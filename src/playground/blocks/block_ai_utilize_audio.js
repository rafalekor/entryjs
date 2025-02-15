import AudioUtils from '../../util/audioUtils';

Entry.AI_UTILIZE_BLOCK.audio = {
    name: 'audio',
    imageName: 'audio.svg',
    category: 'audio',
    sponsorText: 'Powered by {image}',
    sponsorImage: 'naverClova.png',
    sponsorOnImage: 'naverClovaOn.png',
    title: {
        ko: '음성 인식',
        en: 'Speech recognition',
        jp: 'オーディオ検出',
    },
    titleKey: 'template.voice_title_text',
    description: Lang.Msgs.ai_utilize_audio_description,
    descriptionKey: 'Msgs.ai_utilize_audio_description',
    isInitialized: false,
    async init() {
        await AudioUtils.initialize();
        Entry.AI_UTILIZE_BLOCK.audio.isInitialized = true;
    },
};

Entry.AI_UTILIZE_BLOCK.audio.getBlocks = function() {
    return {
        audio_title: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.voice_title_text,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'center',
                },
            ],
            def: {
                type: 'audio_title',
            },
            class: 'audio',
            isNotFor: ['audio'],
            events: {},
        },
        check_microphone: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'check_microphone',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'audio',
            isNotFor: ['audio'],
            async func(sprite, script) {
                try {
                    if (!AudioUtils.isInitialized) {
                        await AudioUtils.initialize();
                    }
                    return AudioUtils.audioInputList.length > 0;
                } catch (err) {
                    return false;
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        },

        speech_to_text_convert: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/ai_utilize_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                type: 'speech_to_text_convert',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'audio',
            isNotFor: ['audio'],
            async func(sprite, script) {
                if (!AudioUtils.isInitialized) {
                    await AudioUtils.initialize();
                }
                if (AudioUtils.isRecording) {
                    return;
                }
                try {
                    AudioUtils.isRecording = true;
                    Entry.container.enableSttValue();
                    const result = await AudioUtils.startRecord(60 * 1000);
                    Entry.dispatchEvent('audioRecordingDone');
                    Entry.container.setSttValue(result || 0);
                } catch (e) {
                    Entry.container.setSttValue(0);
                    throw e;
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        },

        speech_to_text_get_value: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'speech_to_text_get_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'audio',
            isNotFor: ['audio'],
            func(sprite, script) {
                return Entry.container.getSttValue();
            },
            syntax: {
                js: [],
                py: [],
            },
        },

        get_microphone_volume: {
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'get_microphone_volume',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'audio',
            isNotFor: ['audio'],
            async func(sprite, script) {
                if (!AudioUtils.isInitialized) {
                    await AudioUtils.initialize();
                }
                return AudioUtils.currentVolume;
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};
