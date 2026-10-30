# Neural speech components

- Kokoro.js 1.2.1 — https://github.com/hexgrad/kokoro/tree/main/kokoro.js — Apache-2.0. License copy: `public/licenses/kokoro-js.txt`.
- Kokoro-82M-v1.0 ONNX model — https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX — model card declares Apache-2.0. Weights and voice files are downloaded from the publisher, not included in this repository.
- Transformers.js — https://github.com/huggingface/transformers.js — Apache-2.0. License copy: `public/licenses/transformers-js.txt`.
- Phonemizer — https://github.com/xenova/phonemizer.js — package license copy: `public/licenses/phonemizer.txt`; upstream contains the implementation and its eSpeak NG integration.

The lockfile identifies the versions and licenses of transitive packages, including ONNX Runtime. No third-party TTS service is called to synthesize the learner's text.
