---
title: "Banachewicz, Massaron :: The Kaggle Book: Data Analysis and Machine Learning for Competitive Data Science"
author: ["Konrod Banachewicz Luca Massaron Anthony Goldbloom"]
lastmod: 2024-09-29T20:53:59-04:00
draft: false
creator: "Emacs 29.4 (Org mode 9.8 + ox-hugo)"
---

Book on Kaggle. I don't particularly care about competitions but am hoping to
maybe find some decent general ML optimization tips. Thus, I'm skipping the
first couple of beginning chapters.

## Competition Tasks and Metrics {#competition-tasks-and-metrics}

Interestingly, there's a metadata you can mine in Kaggle, the book shows the
most common evaluation metrics from 2015-2021

### Metric Table {#metric-table}

| algorithm                   | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | Total |
| --------------------------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ----- |
| AUC                         | 4    | 4    | 1    | 3    | 3    | 2    | 0    | 17    |
| LogLoss                     | 2    | 2    | 5    | 2    | 3    | 2    | 0    | 16    |
| MAP@{K}                     | 1    | 3    | 0    | 4    | 1    | 0    | 1    | 10    |
| CategorizationAccuracy      | 1    | 0    | 4    | 0    | 1    | 2    | 0    | 8     |
| MulticlassLoss              | 2    | 3    | 2    | 0    | 1    | 0    | 0    | 8     |
| RMSLE                       | 2    | 1    | 3    | 1    | 1    | 0    | 0    | 8     |
| QuadraticWeightedKappa      | 3    | 0    | 0    | 1    | 2    | 1    | 0    | 7     |
| MeanFScoreBeta              | 1    | 0    | 1    | 2    | 1    | 2    | 0    | 7     |
| MeanBestErrorAtK            | 0    | 0    | 2    | 2    | 1    | 1    | 0    | 6     |
| MCRMSLE                     | 0    | 0    | 1    | 0    | 0    | 5    | 0    | 6     |
| MCAUC                       | 1    | 0    | 1    | 0    | 0    | 3    | 0    | 5     |
| RMSE                        | 1    | 1    | 0    | 3    | 0    | 0    | 0    | 5     |
| Dice                        | 0    | 1    | 1    | 0    | 2    | 1    | 0    | 5     |
| GoogleGlobalAP              | 0    | 0    | 1    | 2    | 1    | 1    | 0    | 5     |
| MacroFScore                 | 0    | 0    | 0    | 1    | 0    | 2    | 1    | 4     |
| Score                       | 0    | 0    | 3    | 0    | 0    | 0    | 0    | 3     |
| CRPS                        | 2    | 0    | 0    | 0    | 1    | 0    | 0    | 3     |
| OpenImagesObjectDetectionAP | 0    | 0    | 0    | 1    | 1    | 1    | 0    | 3     |
| MeanFScore                  | 0    | 0    | 1    | 0    | 0    | 0    | 2    | 3     |
| RSNAObjectDetectionAP       | 0    | 0    | 0    | 1    | 0    | 1    | 0    | 2     |

### Handling Never Before Seen Metrics {#handling-never-before-seen-metrics}

There are tips from a grandmaster showing how to understand certain metrics

- <https://www.kaggle.com/carlolepelaars/understanding-the-metric-spearman-s-rho>
- <https://www.kaggle.com/carlolepelaars/understanding-the-metric-quadratic-weighted-kappa>
- <https://www.kaggle.com/rohanrao/osic-understanding-laplace-log-likelihood>

Additionally, tips are given on his workflow

- Understand the problem statement
- Curating the dataset for the problem statement
- Deep dive into the data
- Build a simple pipeline
- Engineer features / hyperparameters, different models
- Read discussions / Domain knowledge, tweak features?
- Ensemble models
- Deploy

#### Regression {#regression}

Estimation of a continuous value.

**MSE** = 1/n \* SSE (The square of differences between your predictions and the
'real' values)

**R^2** = SSE / SST (sum of squares total, variance of the response)

R squared compares the squared errors of the model against the suqared errors
from the simplest model possible, the average of the response.

**RMSE**, square root of MSE - interesting due to MSE, large prediction errors
penalized due to squaring, however, in the RMSE, the root effect diminishes it.
Of course ,outliers still affect a lot, but just a thing to note. Discussed is
using MSE, then square root and squaring the results.
`TransformedTargetRegressor` in scikitlearn can help.

**RMSLE**, adds a log error. MCRMSLE is another variant. what you care for this is
the scale of your predictions with respect to the scale of the ground truth.
Log transform to target before fitting it can help, reversing with an
exponential function.

**MAE** - mean absolute error, is, as it says, the absolute value of the difference
between the prediction and the target. Slower convergence since you're
optimizing for the median vs. mean (L1 vs. L2 norm)

Most of the weird targets are just variations of these standard ones.

#### Classification {#classification}

##### Binary {#binary}

**Accuracy** - Simply # correct / total answers, can be misleading if classes are
unbalanced, e.g. if one class is 99% of the data, you can simply predict that
class and be 99% correct.

**Precision** - TP / (TP + FP) - correctness of predicting a positive

**Recall (Sensitivity)** - TP / (TP + FN)

The precision/recall trade-off occurs because of the threshold for thep
rediction. If you increase the threshold, you get more precision but less
recall.

Average precision computes the mean precision for all recall values from 0
to 1. Useful for object detection, but also on tabular data. It can prove
valuable for fraud detection problems.

This is why most use the **F1 Score** which is the harmonic mean of precision and
recall. In some cases the **F-beta** score is used which is the weighted harmonic
mean between precision / recall.

**Log loss / ROC-AUC** - log loss is also known as cross-entropy in deep learning.
Implication that the objective is to estimate as correctly as possible the
probability of an example being of a positive class. ROC-AUC is the "area
under the curve" of the Receiver Operating Characteristic (ROC) - true
positive rate plotted against false positive rate, equivalent to one minus the
true negative rate.

**Matthews Correlation Coefficient (MCC)** -

<https://www.kaggle.com/ratthachat/demythifying-matthew-correlation-coefficients-mcc> -
for an explainer

Interesting as it looks as the positive and negative precision summed offset
by 1, then multiplied by a ratio of sqrt((TP + FP) \* (TN + FN) /
PositiveLabels \* negativeLabels)

This lets you get higher performance from both positive and negative class
precision that are more in proportion to the ground truth, scoring from -1
to 1. Works well even when classes are quite imbalanced.

##### Multi-Class {#multi-class}

Generally you can use the binary metrics and summarizing them using a sort of
averaging strategy.

**Macro Averaging** - F1 score for each class then averaged. Each class will count
as much as the others, leading to equal penalizations whe nthe model dcoesn't
perform well with any class.

**Micro Averaging** Sum all the contributions from each class to compute an
aggregated F1 score.

**Weighting** Same as Macro, but then make a weighted average mean, summing the
weights to 1. Useful for taking into account the frequency of positive cases
that are relevant to your problem.

##### Object {#object}

**Intersection Over Union (IOU) / Jaccard Index** - generally two images to compare,
using 1/0 for ground truth/otherwise. Overlap between prediction and ground
truth mask / dividing by area of the union.

**Dice Coefficient** - area of overlap between prediction / ground truth doubled
and then divided by the sum of prediction and ground truth.

IoU tends to penalize the overall average more if a single class prediction is
wrong.

##### Recommendation / Multi-label Classification {#recommendation-multi-label-classification}

**Mean Average Precision at K (MAP@{K})** -

This seems to be a complex metric. The mean average precision @ K, k as the
cutoff. The average of P@K computer over all values ranging from 1 to k using
the top prediction, the second, the third, etc. until k.

#### Optimizing Metrics {#optimizing-metrics}

Discusses metrics, since a lot of out-of-the-box algorithms don't let you choose
your evaluation function (or have limited ones) - and your goal might not align
with the competition.

- <https://github.com/benhamner/Metrics>
- <https://www.kaggle.com/bigironsphere/loss-function-library-keras-pytorch/notebook>

##### Post-Processing {#post-processing}

This means that your predictions are transformed by means of as function into
something else that presents a better evaluation.

An example was using a regression to predict a classification problem, using
boundaries as thresholds then optimizing to find a better set of boundaries.

See: <https://www.kaggle.com/c/petfinder-adoption-prediction/discussion/76107>

When your predicted probabilities are misaligned with the training distribution
of the target, there's a calibration function in scikit-learn -

pipes your predictions into a post-processing function

- Sigmoid (Plat's scaling - basically a logistic regression)
- Isotonic Regression (non-parametric regression - overfits if few examples)

## Good Validation {#good-validation}

Adaptive overfitting - basically using a test set over and over, there should
be a final hold-out.

Bias vs. Variance - model not complicated/expressive enough to capture
complexity of problem causing the prediction to by biased, vs. overcomplication
causing a scattershot of a prediction due to the model recording more details
and noise.

good overfitting definition - "The process of learning elements of the training
set that have no generalization"

### Strategies {#strategies}

The basic train-test split, with ~80/20 - chance of extract non-representative
sample. Can use stratification which ensures that proportions of certain
features are respected in the sampled data.

Probabilistic approaches are more useful for competitions (usually) - more
computationally expensive. Law of large numbers, repeatedly sampling and
reducing error. Examples are k-fold, subsambling and bootstrapping

#### k-fold cross-validation {#k-fold-cross-validation}

folding k times, training and predicting against the
fold then averaging. An important thing to note is this can measure
generalizability and the score shouldn't be compared purely against simple
train/test splits. k = n is leave one out, but these are highly correlated
against eachother and is more representative of the dataset itself than how it
would perform on unknown data.

choosing k, the smaller it is, the more bias, but the higher, the more
correlated and you lose out on interesting properties when predicting on
unseen data. Commonly set to 5/7/10.

Stratified k-fold is an option when you need to preserve the distribution of a
variable / proportion of small classes (spam / fraud datasets, etc.)

Scikit-multilearn, IterativeStratification

Interestingly, you can make good use of stratification in regression problems,
helping your regressor to fit during cross validation - creating a discrete
proxy for the target

<https://www.kaggle.com/lucamassaron/are-you-doing-cross-validation-the-best-way>

Sturges' rule - np.floor(1 + np.log2(len(X_train))) --- (helpful to determine
how many bins)

cluster analysis on the features and then using predicted clusters as strata,
PCA -&gt; k-means

GroupKFold - non-i.i.d data, grouping among examples,

Using fixed lookback seems to be suggested (essentially windowing the training
-and- validation) because otherwise the increasing time window just shows
decreasing bias, confusing with model performance

Nested cross validation! - basically cross validating inside cross validating

#### Subsampling &amp; Bootstrap {#subsampling-and-bootstrap}

Subsampling is similar to k-fold, but you basically choose the amount of samples, no fixed
folds.

Devised to conclude the error distribution of an estimate, the bootstrap draws
a sample, with replacement that is the same size as the available data.
Interesting discussion of the 632 method, but seems intractable for machine
learning. While not often, bootstrapping is mentioned as an alternative to
cross-validation, where, due to outliers or heterogeneous examples, there is a
large standard error of the evaluation metric in CV.

Worth looking into - <https://www.kaggle.com/anokas/finding-boatids> - discussing
on how to figure out how to identify the target when the context is similar in
images

### Adversarial Validation {#adversarial-validation}

This is an interesting thing meant for competition, -however- it can be
used for model drift. This essentially involves training a classifier between
train and test datasets and looking at the ROC AUC to see if they're similar,
with .50 showing they are. There's a couple strategies like removing variables
and mimicking the test set if it's uneven.

### Leakage (Data) {#leakage--data}

Another competition specific thing, but worth noting is basically metadata /
ordering, etc. etc. that might give away something about the dataset.

## Tabular {#tabular}

The usefulness of synthetic data is discussed -
<https://www.kaggle.com/lucamassaron/how-to-use-ctgan-to-generate-more-data>

### EDA {#eda}

Auto-profiling solutions are discussed, AutoViz, Pandas Profiling, Sweetviz

UMAP and t-SNE

- <https://distill.pub/2016/misread-tsne/>
- <https://pair-code.github.io/understanding-umap/>
- <https://www.kaggle.com/lucamassaron/interesting-eda-tsne-umap/>

These links appear helpful, noting that they're generally more revealing than
classical methods based on variance restructuring like PCA / SVD.

Reducing memory size of pandas (or just use something else, I suppose):

<https://www.kaggle.com/arjanso/reducing-dataframe-memory-size-by-65>

### Feature Engineering {#feature-engineering}
