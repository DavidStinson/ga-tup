const templateFilesBaseURL = "https://pages.git.generalassemb.ly/modular-curriculum-all-courses/TEMPLATE-FILES/";
const config = {
    templateUrls: {
        lecture: {
            originalAssets: `${templateFilesBaseURL}/original-assets-readme.txt`,
            fallbackClp: `${templateFilesBaseURL}/lecture-clp-fallback.txt`,
        },
        lab: {
            originalAssets: `${templateFilesBaseURL}/original-assets-readme.txt`,
            fallbackClp: `${templateFilesBaseURL}/lab-clp-fallback.txt`,
        },
    },
    path: {
        rootAssets: [
            "./assets/hero.png",
            "./assets/instructor-guide.png",
            "./assets/release-notes.png",
            "./assets/video-hub.png",
            "./assets/originals/hero.eps",
            "./assets/originals/instructor-guide.eps",
            "./assets/originals/release-notes.eps",
            "./assets/originals/video-hub.eps",
        ],
        referencesAssets: [
            "./references/assets/hero.png",
            "./references/assets/originals/hero.eps",
        ],
        internalResourcesAssets: [
            "./internal-resources/assets/hero-instructor-guide.png",
            "./internal-resources/assets/hero-release-notes.png",
            "./internal-resources/assets/originals/hero-instructor-guide.eps",
            "./internal-resources/assets/originals/hero-release-notes.eps",
        ],
    },
    lectureStaticDirs: [
        ".git",
        "_layouts",
        "assets",
        "canvas-landing-pages",
        "internal-resources",
        "level-up",
        "references",
        "node_modules",
    ],
    labStaticDirs: [
        ".git",
        "_layouts",
        "assets",
        "canvas-landing-pages",
        "internal-resources",
        "node_modules",
    ],
    staticDir: {
        defaultLayout: {
            path: "./_layouts",
            dirName: "_layouts",
            dirNameTitleCase: "_layouts",
            dirNameCamelCase: "_layouts",
        },
        canvasLandingPages: {
            path: "./canvas-landing-pages",
            dirName: "canvas-landing-pages",
            dirNameTitleCase: "Canvas Landing Pages",
            dirNameCamelCase: "canvasLandingPages",
        },
        internalResources: {
            path: "./internal-resources",
            dirName: "internal-resources",
            dirNameTitleCase: "Internal Resources",
            dirNameCamelCase: "internalResources",
        },
        levelUp: {
            path: "./level-up",
            dirName: "level-up",
            dirNameTitleCase: "Level Up",
            dirNameCamelCase: "levelUp",
        },
        references: {
            path: "./references",
            dirName: "references",
            dirNameTitleCase: "References",
            dirNameCamelCase: "references",
        },
        videoGuide: {
            path: "./internal-resources/video-guide",
            dirName: "video-guide",
            dirNameTitleCase: "Video Guide",
            dirNameCamelCase: "videoGuide",
        },
    },
    staticFile: {
        defaultLayout: {
            path: "./_layouts/default.html",
            lectureTemplateUrl: `${templateFilesBaseURL}/default-html.txt`,
            labTemplateUrl: `${templateFilesBaseURL}/default-html.txt`,
        },
        rootReadme: {
            path: "./README.md",
            lectureTemplateUrl: `${templateFilesBaseURL}/lecture-root-readme.txt`,
            labTemplateUrl: `${templateFilesBaseURL}/lab-root-readme.txt`,
        },
        videoHub: {
            path: "./internal-resources/video-hub.md",
            lectureTemplateUrl: `${templateFilesBaseURL}/video-hub.txt`,
            labTemplateUrl: `${templateFilesBaseURL}/video-hub.txt`,
        },
        releaseNotes: {
            path: "./internal-resources/release-notes.md",
            lectureTemplateUrl: `${templateFilesBaseURL}/lecture-release-notes.txt`,
            labTemplateUrl: `${templateFilesBaseURL}/lab-release-notes.txt`,
        },
        instructorGuide: {
            path: "./internal-resources/instructor-guide.md",
            lectureTemplateUrl: `${templateFilesBaseURL}/instructor-guide.txt`,
            labTemplateUrl: `${templateFilesBaseURL}/instructor-guide.txt`,
        },
        references: {
            path: "./references/README.md",
            lectureTemplateUrl: `${templateFilesBaseURL}/references.txt`,
            labTemplateUrl: `${templateFilesBaseURL}/references.txt`,
        },
    },
    vars: {
        pklTemplateUrl: "https://pages.git.generalassemb.ly/modular-curriculum-all-courses/universal-resources-internal/static/v2/pkl/template.pkl",
    }
};
export { config };
