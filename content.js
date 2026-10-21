/* Public dataset descriptions. */
window.OCTOSENSE_CONTENT = {
  "cards": {
    "widar3": {
      "variant": "g6",
      "name": "Widar3.0",
      "id": "widar3",
      "color": "#2f5e9c",
      "source": "Widar3.0 project",
      "url": "https://tns.thss.tsinghua.edu.cn/widar3.0/index.html",
      "inputs": "Wi-Fi CSI",
      "task": "Gesture classification · categorical target",
      "axes": "time · subc · tx · rx",
      "protocols": "gesture / official",
      "fields": [
        "user_id",
        "gesture_id",
        "orientation",
        "trial",
        "rx_id",
        "room"
      ],
      "physical": "Packet timestamps; physical metadata when available",
      "target": "gesture class",
      "targetDescription": "A categorical target under the gesture binding.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi CSI",
          "axes": "time · subc · tx · rx",
          "physical": "Packet timestamps; physical metadata when available"
        }
      }
    },
    "widargait": {
      "variant": "default",
      "inputs": "Wi-Fi CSI",
      "task": "Gait identification · categorical target",
      "axes": "time · subc · tx · rx",
      "protocols": "gait-identification / default",
      "fields": [
        "sample_id",
        "user_id",
        "track_id",
        "rep_id",
        "rx_id"
      ],
      "physical": "Intel 5300 CSI · nominal 1,000 Hz",
      "target": "person identity",
      "name": "WiFi Gait",
      "id": "widargait",
      "source": "WiFi Gait project",
      "url": "https://tns.thss.tsinghua.edu.cn/widar3.0/index.html",
      "color": "#547292",
      "targetDescription": "The target remains associated with its source sample.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi CSI",
          "axes": "time · subc · tx · rx",
          "physical": "Intel 5300 CSI · nominal 1,000 Hz"
        }
      }
    },
    "signfi": {
      "variant": "home",
      "inputs": "Wi-Fi CSI",
      "task": "Sign-language classification · categorical target",
      "axes": "time · subc · tx · rx",
      "protocols": "gesture-classification / default",
      "fields": [
        "sample_index",
        "environment",
        "direction",
        "variant"
      ],
      "physical": "Intel 5300 CSI · nominal 1,000 Hz",
      "target": "sign class",
      "name": "SignFi",
      "id": "signfi",
      "source": "SignFi project",
      "url": "https://github.com/yongsen/SignFi",
      "color": "#237a74",
      "targetDescription": "The target remains associated with its source sample.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi CSI",
          "axes": "time · subc · tx · rx",
          "physical": "Intel 5300 CSI · nominal 1,000 Hz"
        }
      }
    },
    "falldar": {
      "variant": "default",
      "inputs": "Wi-Fi CSI",
      "task": "Fall detection · binary target",
      "axes": "time · subc · tx · rx",
      "protocols": "fall-detection / default",
      "fields": [
        "date",
        "user_name",
        "clip_index",
        "receiver_id"
      ],
      "physical": "Intel 5300 CSI · nominal 1,000 Hz",
      "target": "fall / nonfall",
      "name": "FallDar",
      "id": "falldar",
      "source": "FallDar project",
      "url": "https://doi.org/10.1109/TMC.2022.3188779",
      "color": "#996949",
      "targetDescription": "The target remains associated with its source sample.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi CSI",
          "axes": "time · subc · tx · rx",
          "physical": "Intel 5300 CSI · nominal 1,000 Hz"
        }
      }
    },
    "csi_bench": {
      "variant": "fall-detection",
      "inputs": "Wi-Fi CSI · seven task variants",
      "task": "Activity, identity, fall, breathing, localization, motion, proximity",
      "axes": "Task-specific named axes",
      "protocols": "Task-specific / default",
      "fields": [
        "sample_id",
        "subject_id",
        "record_id",
        "variant"
      ],
      "physical": "Task-specific CSI schema",
      "target": "task-specific target",
      "name": "CSI-Bench",
      "id": "csi_bench",
      "source": "CSI-Bench project",
      "url": "https://github.com/guozhen-jenn-zhu/CSI-Bench-Real-WiFi-Sensing-Benchmark",
      "color": "#675c89",
      "targetDescription": "The target remains associated with its source sample.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi CSI · seven task variants",
          "axes": "time · feature · channel",
          "physical": "Task-specific CSI schema"
        }
      }
    },
    "hupr": {
      "variant": "default",
      "name": "HuPR",
      "id": "hupr",
      "color": "#237a74",
      "source": "HuPR project",
      "url": "https://github.com/robert80203/HuPR-A-Benchmark-for-Human-Pose-Estimation-Using-Millimeter-Wave-Radar",
      "inputs": "mmWave radar maps · default",
      "task": "Human pose · structured target",
      "axes": "range · azimuth · elevation · sensor",
      "protocols": "human-pose / default",
      "fields": [
        "file_path",
        "file_index",
        "frame_index"
      ],
      "physical": "Radar-map layout · AWR1843 acquisition",
      "target": "joints [14, 2]\nbbox [4]",
      "targetDescription": "Pose and bounding-box arrays stay associated with the frame.",
      "modalityViews": {
        "mmwave": {
          "supported": true,
          "inputs": "mmWave radar maps · default",
          "axes": "channel · height · width",
          "physical": "Radar-map layout · AWR1843 acquisition"
        }
      }
    },
    "mmfi": {
      "variant": "protocol3",
      "inputs": "Wi-Fi CSI or mmWave point cloud · protocol3",
      "task": "Activity classification · categorical target",
      "axes": "Wi-Fi: time · subc · tx · rx",
      "protocols": "default / default",
      "fields": [
        "subject",
        "action",
        "sample_id"
      ],
      "physical": "Wi-Fi CSI; mmWave: time · point · feature",
      "target": "activity class",
      "name": "MM-Fi",
      "id": "mmfi",
      "source": "MM-Fi project",
      "url": "https://ntu-aiot-lab.github.io/mm-fi",
      "color": "#59705a",
      "targetDescription": "The target remains associated with its source sample.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi CSI · protocol3",
          "axes": "rx · subc · time",
          "physical": "5 GHz · 40 MHz · 320 Hz · Atheros CSI Tool"
        },
        "mmwave": {
          "supported": true,
          "inputs": "mmWave point cloud · protocol3",
          "axes": "time · point · feature",
          "physical": "60 GHz · mmWave point cloud"
        }
      }
    },
    "xrf55": {
      "variant": "dml_wifi",
      "inputs": "Wi-Fi CSI or mmWave · raw / DML",
      "task": "Activity classification · categorical target",
      "axes": "Modality-specific named axes",
      "protocols": "default / default or dml_train_val",
      "fields": [
        "subject_id",
        "relative_path",
        "label_name"
      ],
      "physical": "Wi-Fi CSI or preprocessed mmWave",
      "target": "activity class",
      "name": "XRF55",
      "id": "xrf55",
      "source": "XRF55 project",
      "url": "https://github.com/airslab2020/XRF55-repo",
      "color": "#467d8a",
      "targetDescription": "The target remains associated with its source sample.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi CSI · raw / DML",
          "axes": "channel · time",
          "physical": "5.64 GHz · 20 MHz · XRF55 Wi-Fi",
          "variant": "dml_wifi"
        },
        "mmwave": {
          "supported": true,
          "inputs": "mmWave · raw / DML",
          "axes": "channel · height · width",
          "physical": "60 GHz · IWR6843ISK / DCA1000",
          "variant": "dml_mmwave"
        },
        "rfid": {
          "supported": false
        }
      }
    },
    "xrfv2": {
      "variant": "clip",
      "inputs": "Wi-Fi · clip",
      "task": "Activity classification · categorical target",
      "axes": "Clip-specific named axes",
      "protocols": "default / default",
      "fields": [
        "volunteer_id",
        "scene_id",
        "segment_start",
        "segment_end"
      ],
      "physical": "Wi-Fi action clips",
      "target": "action class",
      "name": "XRF V2",
      "id": "xrfv2",
      "source": "XRF V2 project",
      "url": "https://github.com/airslab2020/XRFV2",
      "color": "#697891",
      "targetDescription": "The target remains associated with its source sample.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi · clip",
          "axes": "time · rx · tx · subc",
          "physical": "5.64 GHz · 20 MHz · Wi-Fi"
        }
      }
    },
    "octonet": {
      "variant": "None",
      "inputs": "Wi-Fi CSI, mmWave, or UWB · selected node",
      "task": "Activity classification · categorical target",
      "axes": "Wi-Fi: time · subc · tx · rx",
      "protocols": "default / default",
      "fields": [
        "subject_id",
        "activity",
        "sample_id"
      ],
      "physical": "Node-specific Wi-Fi, radar, and UWB signals",
      "target": "activity class",
      "name": "OctoNet",
      "id": "octonet",
      "source": "OctoNet project",
      "url": "https://aiot-lab.github.io/OctoNet/",
      "color": "#7b658c",
      "targetDescription": "The target remains associated with its source sample.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "inputs": "Wi-Fi CSI · selected node",
          "axes": "time · subc · tx · rx",
          "physical": "5.2 GHz · 40 MHz · AX200"
        },
        "mmwave": {
          "supported": true,
          "inputs": "SFCW radar maps · Vayyar · single node",
          "axes": "range · azimuth · time",
          "physical": "60 GHz · Vayyar mmWave",
          "label": "mmWave · SFCW"
        },
        "mmwave_fmcw": {
          "supported": true,
          "family": "mmwave",
          "label": "mmWave · FMCW",
          "inputs": "FMCW point cloud · node 1",
          "axes": "node · time · point · feature",
          "physical": "Point features: x · y · z · velocity",
          "options": {
            "node_ids": [
              1
            ]
          }
        },
        "uwb": {
          "supported": true,
          "inputs": "UWB impulse response · node 1",
          "axes": "time · tap",
          "physical": "Timestamp coordinates · indexed CIR taps",
          "options": {"node_id": 1}
        }
      }
    },
    "operanet": {
      "variant": "uwb1",
      "name": "OPERAnet",
      "id": "operanet",
      "color": "#a17227",
      "source": "OPERAnet data collection",
      "url": "https://doi.org/10.6084/m9.figshare.c.5551209.v1",
      "inputs": "Wi-Fi CSI or UWB CIR",
      "task": "Activity classification · categorical target",
      "axes": "time · cir_tap",
      "protocols": "activity / subject_holdout",
      "fields": [
        "person_id",
        "room_no",
        "exp_id",
        "start_index",
        "end_index"
      ],
      "physical": "Ordinal time samples · sampling rate unknown",
      "target": "activity class",
      "targetDescription": "One of seven activities in the selected recognition binding.",
      "modalityViews": {
        "wifi": {
          "supported": true,
          "label": "Wi-Fi",
          "inputs": "Wi-Fi CSI · wificsi1 / wificsi2",
          "variant": "wificsi1 / wificsi2",
          "axes": "time · subc · tx · rx",
          "physical": "30 subcarriers · 3 Tx · 3 Rx · timestamp coordinates"
        },
        "uwb": {
          "supported": true,
          "inputs": "UWB CIR · uwb1 / uwb2",
          "axes": "time · cir_tap",
          "physical": "35 taps (UWB1) · 50 taps (UWB2) · sampling rate unknown"
        },
        "pwr": {
          "supported": false
        }
      }
    }
  },
  "modelFamilies": [
  {
    "id": "sequence",
    "name": "Sequence models",
    "models": [
      "rfnet",
      "lstm",
      "transformer",
      "vit",
      "patchtst",
      "timesformer1d",
      "widar3_cnn_gru",
      "cnn_gru",
      "gaitfi",
      "official_matlab_cnn",
      "laxcat",
      "that"
    ]
  },
  {
    "id": "image_like",
    "name": "Image models",
    "models": [
      "resnet18",
      "densenet",
      "alexnet",
      "swin",
      "slnet"
    ]
  },
  {
    "id": "reference",
    "name": "Reference models",
    "models": [
      "octonet_rfnet",
      "csi_bench_resnet18",
      "xrf55_resnet1d",
      "xrf55_resnet2d",
      "rfcrate_rfnet",
      "mlp",
      "cnn1d",
      "widargait_units"
    ]
  },
  {
    "id": "pose",
    "name": "Pose models",
    "models": [
      "resnet18_pose",
      "stfnet",
      "units"
    ]
  },
  {
    "id": "rfcrate",
    "name": "Complex-valued models",
    "models": [
      "rf_crate",
      "rf_crate_small"
    ]
  }
],
  "curation": [
    {"id":"widar3","name":"Widar3.0","color":"#2f5e9c","background":"#edf3fa"},
    {"id":"signfi","name":"SignFi","color":"#237a74","background":"#eef7f5"},
    {"id":"widargait","name":"WiFi Gait","color":"#a17227","background":"#fbf5e9"}
  ],
  "datasets": [
    {
      "id": "widar3",
      "name": "Widar3.0",
      "modalities": [
        "wifi"
      ],
      "task": "Gesture recognition",
      "url": "https://tns.thss.tsinghua.edu.cn/widar3.0/index.html",
      "size": "258K instances · full dataset"
    },
    {
      "id": "widargait",
      "name": "WiFi Gait",
      "modalities": [
        "wifi"
      ],
      "task": "Gait identification",
      "url": "https://tns.thss.tsinghua.edu.cn/widar3.0/index.html",
      "size": "22,528 receiver records"
    },
    {
      "id": "signfi",
      "name": "SignFi",
      "modalities": [
        "wifi"
      ],
      "task": "Sign-language classification",
      "url": "https://github.com/yongsen/SignFi",
      "size": "2,760–7,500 samples / variant"
    },
    {
      "id": "falldar",
      "name": "FallDar",
      "modalities": [
        "wifi"
      ],
      "task": "Fall detection",
      "url": "https://doi.org/10.1109/TMC.2022.3188779",
      "size": "856 raw records"
    },
    {
      "id": "csi_bench",
      "name": "CSI-Bench",
      "modalities": [
        "wifi"
      ],
      "task": "Seven sensing tasks",
      "url": "https://github.com/guozhen-jenn-zhu/CSI-Bench-Real-WiFi-Sensing-Benchmark",
      "size": "461+ hours of recordings"
    },
    {
      "id": "hupr",
      "name": "HuPR",
      "modalities": [
        "mmwave"
      ],
      "task": "Human pose estimation",
      "url": "https://github.com/robert80203/HuPR-A-Benchmark-for-Human-Pose-Estimation-Using-Millimeter-Wave-Radar",
      "size": "141,000 triplets · 235 sequences"
    },
    {
      "id": "mmfi",
      "name": "MM-Fi",
      "modalities": [
        "wifi",
        "mmwave"
      ],
      "task": "Activity recognition",
      "url": "https://ntu-aiot-lab.github.io/mm-fi",
      "size": "320K+ synchronized frames · all modalities"
    },
    {
      "id": "xrf55",
      "name": "XRF55",
      "modalities": [
        "wifi",
        "mmwave"
      ],
      "task": "Activity recognition",
      "url": "https://github.com/airslab2020/XRF55-repo",
      "size": "42,900 clips / modality"
    },
    {
      "id": "xrfv2",
      "name": "XRF V2",
      "modalities": [
        "wifi"
      ],
      "task": "Activity recognition",
      "url": "https://github.com/airslab2020/XRFV2",
      "size": "853 source action sequences"
    },
    {
      "id": "octonet",
      "name": "OctoNet",
      "modalities": [
        "wifi",
        "mmwave",
        "uwb"
      ],
      "task": "Activity recognition",
      "url": "https://aiot-lab.github.io/OctoNet/",
      "size": "67.72M+ frames · all modalities"
    },
    {
      "id": "operanet",
      "name": "OPERAnet",
      "modalities": [
        "uwb",
        "wifi"
      ],
      "task": "Activity recognition",
      "url": "https://doi.org/10.6084/m9.figshare.c.5551209.v1",
      "size": "≈8 hours · all modalities"
    }
  ],
  "specExplanations": {
    "dataset": "Select the source, input modality, variant, and local data location.",
    "split": "The split scheme lives inside dataset. The executed split is also recorded in run artifacts.",
    "task": "Select the task and bind each sample to its corresponding labels or structured targets.",
    "transform": "Ordered operators include preprocessing and explicit model-input alignment.",
    "model": "Select a registered model and its input / output configuration.",
    "runtime": "Set execution and training controls. Optional optimizer settings live in runtime.training."
  },
  "specExcerpt": `api_version: octosense.benchmarks/v2
kind: BenchmarkSpec
dataset:
  dataset_id: operanet
  modalities: [uwb]
  variant: uwb2
  split_scheme: subject_holdout
  dataset_root: ./data/operanet
task:
  task_id: classification/activity
  task_binding: activity
transform:
  steps:
    - operator_id: TemporalResize
      params: {axis_name: time, target_length: 256}
    - operator_id: Magnitude
    - operator_id: SampleZScoreNormalize
model:
  model_id: cnn1d
  entry_overrides: {num_classes: 7}
runtime: {device: cpu, batch_size: 32, epochs: 20, seed: 0}`,
  "specFull": `api_version: octosense.benchmarks/v2
kind: BenchmarkSpec
dataset:
  dataset_id: operanet
  modalities:
  - uwb
  variant: uwb2
  split_scheme: subject_holdout
  dataset_root: ./data/operanet
task:
  task_id: classification/activity
  task_binding: activity
transform:
  steps:
  - operator_id: TemporalResize
    params:
      axis_name: time
      target_length: 256
  - operator_id: Magnitude
    params: {}
  - operator_id: SampleZScoreNormalize
    params: {}
  - operator_id: AutoAlign
    params:
      model_or_contract:
        axes:
        - time
        - feature
        dtype_kind: real
        fixed_sizes: {}
        layout: BTF
model:
  model_id: cnn1d
  entry_overrides:
    num_classes: 7
    hidden_dim: 128
    num_layers: 2
    kernel_size: 5
    dropout: 0.1
runtime:
  device: cpu
  batch_size: 32
  epochs: 20
  seed: 0
  num_workers: 0`
};
