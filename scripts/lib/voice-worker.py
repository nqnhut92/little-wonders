import json
import os
import subprocess
import sys
import tarfile
from pathlib import Path

SAMPLE_INDEX = 170
SPEED = 0.85
NFE_STEP = 32
SEED = 9527


def main() -> None:
    jobs_path = Path(sys.argv[1])
    cache_dir = sys.argv[2]
    threads = int(sys.argv[3])
    jobs = json.loads(jobs_path.read_text(encoding="utf-8"))
    if not jobs:
        return

    from vietvoicetts import ModelConfig, TTSApi

    model_file = Path(cache_dir) / "model-bin.pt"
    cfg = ModelConfig(
        model_cache_dir=cache_dir,
        speed=SPEED,
        nfe_step=NFE_STEP,
        random_seed=SEED,
        intra_op_num_threads=threads,
        inter_op_num_threads=1,
    )
    api = TTSApi(cfg)

    with tarfile.open(model_file, "r") as tar:
        sample = json.load(tar.extractfile("audio_metadata.json"))[SAMPLE_INDEX]
        ref_bytes = tar.extractfile("cleaned_audios/" + sample["file_name"]).read()

    ref_path = jobs_path.parent / f"ref_{os.getpid()}.wav"
    ref_path.write_bytes(ref_bytes)

    try:
        for idx, job in enumerate(jobs, 1):
            out_m4a = Path(job["m4a"])
            if out_m4a.exists():
                continue
            wav_path = Path(job["wav"])
            wav_path.parent.mkdir(parents=True, exist_ok=True)
            out_m4a.parent.mkdir(parents=True, exist_ok=True)
            api.synthesize_to_file(
                text=job["ttsText"],
                output_path=str(wav_path),
                reference_audio=str(ref_path),
                reference_text=sample["text"],
            )
            subprocess.run(
                [
                    "/usr/bin/afconvert",
                    "-f",
                    "m4af",
                    "-d",
                    "aac",
                    "-c",
                    "1",
                    "-b",
                    "48000",
                    str(wav_path),
                    str(out_m4a),
                ],
                check=True,
            )
            wav_path.unlink(missing_ok=True)
            print(f"[worker {os.getpid()}] {idx}/{len(jobs)} -> {out_m4a.name}", flush=True)
    finally:
        ref_path.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
